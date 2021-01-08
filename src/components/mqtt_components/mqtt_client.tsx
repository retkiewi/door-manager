import React, {useEffect} from "react";
import {useState, Fragment} from "react"
import { Connector, Connected, subscribe, setConnectStatus, setPayload } from 'react-mqtt-client'
import {useCollection} from "react-firebase-hooks/firestore";
import {firebaseApp} from "../../firebaseApp";

export const MqttClient = () => {

    const [loadedUsers, loading, error] = useCollection(firebaseApp.firestore().collection('Users'));

    const mqtt = require('mqtt');
    const options = {
        protocol: 'mqtts',
        clientId: 'jp2x2137'
    };
    const client = mqtt.connect('mqtt://test.mosquitto.org:8081', options);
    if(client) {
        console.log('Connected to broker');
    } else {
        console.log('Failed connection to broker');
    }
    client.subscribe('website','door');
    console.log('Subscribed website');

    client.on('message', function (topic, message) {
        console.log('Received message with "'+topic+'" topic"');
        if(topic === 'website') {
            if(checkAccess(message.toString())) {
                client.publish('door', 'granted');
            } else {
                client.publish('door', 'denied');
            }
        }
        if(topic === 'door') {
            console.log("besciak besciak ty chuju");
        }
        client.end();
    });

    function checkAccess (cardID) : boolean {
        console.log("Checking access for "+cardID);
        if(loadedUsers?.docs.length > 0) {
            (loadedUsers?.docs as any).forEach(user => {
                if(user.data().cardID === cardID) {
                    if(user.data().hasAccess) {
                        firebaseApp.firestore().collection("Logs").add({
                            cardID: user.data().cardID,
                            access: "Confirmed",
                            surname: user.data().surname,
                            name: user.data().name,
                            time: Date.now()
                        }).then(() => console.log("Access granted to "+cardID));
                        return true;
                    } else {
                        firebaseApp.firestore().collection("Logs").add({
                            cardID: user.data().cardID,
                            access: "Denied",
                            surname: user.data().surname,
                            name: user.data().name,
                            time: Date.now()
                        }).then(() => console.log("Access denied to "+cardID));
                        return false;
                    }
                }
            });
        }
        console.log("Card doesn't exist");
        return false;
    }
};
