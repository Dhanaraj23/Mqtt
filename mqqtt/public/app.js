const client = new Paho.MQTT.Client("localhost", 9001, "clientId");

// Variable to store the last known temperature for comparison
let lastTemperature = null;

client.connect({
    onSuccess: () => {
        console.log("Connected to MQTT broker");
        client.subscribe("sensor/data");
    },
    onFailure: (error) => {
        console.error("Failed to connect: ", error);
    }
});

client.onMessageArrived = (message) => {
    console.log("Message received:", message.payloadString);

    try {
        const jsonData = JSON.parse(message.payloadString);
        // Assume the JSON data contains user and temperature
        const { user, temperature } = jsonData;

        // Update the web page with user-specific sensor data (if current user matches)
        const currentUser = document.getElementById("userSelect").value;

        // Update temperature on UI even if the value hasn't changed
        if (user === currentUser) {
            document.getElementById("temperature").textContent = `Temperature: ${temperature} °C`;

            // Only update chart if the temperature value has changed
            if (temperature !== lastTemperature) {
                const myChart = Chart.getChart('myChart'); // Ensure we have chart context
                myChart.data.labels.push(new Date().toLocaleTimeString());
                myChart.data.datasets[0].data.push(temperature);
                myChart.update();
            }

            // Update the last known value
            lastTemperature = temperature;
        }
    } catch (e) {
        console.error("Error parsing JSON data: ", e);
    }
};
