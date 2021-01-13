/*
  Connection:

  NodeMCU      RC522
  D1           SDA (SS)
  D5           SCK
  D7           MOSI
  D6           MISO
  D2           RST

  WS2812B:
  D4

  Buzzer:
  D0

  LED Colors:
  Yellow - error
  Blue - everything ok, waiting for card
  Green - door opened
  Red - access denied

*/

#include <SPI.h>
#include <MFRC522.h>
#include <Adafruit_NeoPixel.h>
#include <String.h>

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266WebServer.h>

#include <PubSubClient.h>


#define RST_PIN 4
#define SS_PIN 5

#define LED_PIN 2
#define REDCOLOR led.Color(20, 0, 0)
#define GREENCOLOR led.Color(0, 20, 0)
#define BLUECOLOR led.Color(0, 0, 20)
#define YELLOWCOLOR led.Color(10, 10 ,0)
#define BLACKCOLOR led.Color(0, 0 ,0)


#define BUZZPIN 16

#define CARDIDLENGTH 4

MFRC522 mfrc522(SS_PIN, RST_PIN);    //Create MFRC522 instance

Adafruit_NeoPixel led = Adafruit_NeoPixel(8, LED_PIN, NEO_GRB + NEO_KHZ800);


const char *ssid = "MamNaCiebieOko";
const char *password = "niezgadniesz";
const char *mqtt_server = "172.16.25.129"; 
const char *device_id = "door1";
const char *subscribed_topic = "door1_access";  //Supported responses: OPEN, DENY
const char *published_topic = "door1_scan";

WiFiClient espClient;
PubSubClient client(espClient); 

void setup() {
  led.begin();
  led.setPixelColor(0, YELLOWCOLOR);
  led.show();

  Serial.begin(115200);

  delay(1000);
  WiFi.mode(WIFI_OFF);        //Prevents reconnection issue (taking too long to connect)
  delay(1000);
  WiFi.mode(WIFI_STA);        //This line hides the viewing of ESP as wifi hotspot
  WiFi.begin(ssid, password);     //Connect to your WiFi router
  Serial.println("");
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  //mqtt connection
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  //delay(5000);
  connectmqtt();


  SPI.begin();

  mfrc522.PCD_Init(); //Init MFRC522
  mfrc522.PCD_DumpVersionToSerial();  // Show details of PCD - MFRC522 Card Reader details
  Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));


  led.setPixelColor(0, BLUECOLOR);
  led.show();

  pinMode(BUZZPIN, OUTPUT);
  digitalWrite(BUZZPIN, HIGH);
}

void connectmqtt()
{
  client.connect("ESP32_door1");  // ESP will connect to mqtt broker with clientID
  {
    Serial.println("connected to MQTT");
    client.subscribe(subscribed_topic); //topic=Demo
    client.publish(published_topic,  "driver connected to MQTT");

    if (!client.connected())
    {
      MQTTReconnect();
    }
  }
}

void MQTTReconnect(void)
{
  while (!client.connected()) {
    Serial.println("Attempting MQTT reconnection...");
    if (client.connect("ESP32_clientID")) {
      Serial.println("reconnected to MQTT");
      client.publish(published_topic, "driver reconnected to MQTT");
      client.subscribe(subscribed_topic);

    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      // Wait 2 seconds before retrying
      delay(1000);
      led.setPixelColor(0, YELLOWCOLOR);
      led.show();
      delay(1000);
      led.setPixelColor(0, BLACKCOLOR);
      led.show();
    }
  }
}

void loop() {

  if ( mfrc522.PICC_IsNewCardPresent())
  {
    if ( ! mfrc522.PICC_ReadCardSerial())
    {
      return;
    }

    Serial.println(F("\n\n\n"));
    for (int i = 0; i < mfrc522.uid.size; i++)
      Serial.print((mfrc522.uid.uidByte[i] ), HEX);
    Serial.println();
    mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid));     // Dump debug info about the card; PICC_HaltA() is automatically called

    checkID(IDtoString(mfrc522.uid.uidByte)); //check received id
    client.loop();
    delay(1000);
  }
  client.loop();

}

String IDtoString(byte ID[10])
{
  String result;
  byte hexNumber[2] = {ID[0] / 16, ID[0] % 16};
  for (int j = 0; j < 2; j++)
  {
    result += String(hexNumber[j], HEX);
  }
  for (int i = 1; i < CARDIDLENGTH; i++)
  {
    
    result += ':';
    byte hexNumber[2] = {ID[i] / 16, ID[i] % 16};
    for (int j = 0; j < 2; j++)
    {
      result += String(hexNumber[j], HEX);
    }
  }
  return result;
}

void closeTheDoor(void)
{
  digitalWrite(BUZZPIN, LOW);
  delay(100);
  digitalWrite(BUZZPIN, HIGH);

  led.setPixelColor(0, BLUECOLOR);
  led.show();
}

void openTheDoor(void)
{
  led.setPixelColor(0, GREENCOLOR);
  led.show();
  digitalWrite(BUZZPIN, LOW);
  delay(30);
  digitalWrite(BUZZPIN, HIGH);
}

void accesDenied(void)
{
  led.setPixelColor(0, REDCOLOR);
  led.show();
  digitalWrite(BUZZPIN, LOW);
  delay(30);
  digitalWrite(BUZZPIN, HIGH);
  delay(100);
  digitalWrite(BUZZPIN, LOW);
  delay(100);
  digitalWrite(BUZZPIN, HIGH);
}

void callback(char* topic, byte* payload, unsigned int length) {   //callback includes topic and payload ( from which (topic) the payload is comming)
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  if ( strcmp(topic, subscribed_topic) == 0 )
  {
    if (length >= 4 && (char)payload[0] == 'O' && (char)payload[1] == 'P' && (char)payload[2] == 'E' && (char)payload[3] == 'N') //OPEN
    {
      openTheDoor();
      delay(1000);
      closeTheDoor();
    }
    else if (length >= 4 && (char)payload[0] == 'D' && (char)payload[1] == 'E' && (char)payload[2] == 'N' && (char)payload[3] == 'Y') //DENY
    {
      accesDenied();
      delay(1000);
      closeTheDoor();
    }
    Serial.println();
  }
}

void checkID(String cardID)
{
  bool validate = false;
  if (!client.connected())
    MQTTReconnect();
  String message = String("");
  message += cardID;
  client.publish(published_topic, message.c_str());  //rest is done by callback after reply is received 
  Serial.print("Sent: '");
  Serial.print(message);
  Serial.println("'");
}
