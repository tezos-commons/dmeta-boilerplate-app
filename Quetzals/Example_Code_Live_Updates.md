# Example Code:  Live Updates
```text-plain
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dynamic Image Update with Subscription</title>
    <script>
        // Function to convert hex to a binary blob
        function hexToBlob(hex, contentType) {
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < bytes.length; i++) {
                bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
            }
            return new Blob([bytes], {type: contentType});
        }

        async function fetchInitialData() {
            const execUrl = 'https://dmeta.mantodev.com/exec/mainnet/KT1R1zAm8M2xEmiH12RiqtsbUFwCgYcE6wCN/tokenImage/0';
            try {
                const response = await fetch(execUrl);
                const data = await response.json();
                const subscriptionId = data.SubscriptionId;
                const imageBlob = hexToBlob(data.Body, 'image/png');
                const imageUrl = URL.createObjectURL(imageBlob);
                document.getElementById('liveImage').src = imageUrl;
                return subscriptionId;
            } catch (error) {
                console.error('Error fetching initial data:', error);
                return null;
            }
        }

        function listenForUpdates(subscriptionId) {
            const wsUrl = 'wss://dmeta.mantodev.com/subscribe';
            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                const message = {
                    action: 'subscribe',
                    subscriptions: [subscriptionId],
                    id: 'unique_client_id' // This should be a unique ID for this client
                };
                socket.send(JSON.stringify(message));
            };

            socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                if (data.subscription_update && data.subscription_update === subscriptionId) {
                    // Fetch the updated image using exec call again
                    const updatedData = await fetchInitialData(); // Reuse the function to fetch and update the image
                    if (!updatedData) {
                        console.log('Failed to update the image.');
                    }
                }
            };

            socket.onerror = (error) => {
                console.log('WebSocket Error:', error);
            };
        }

        // Initial setup
        document.addEventListener('DOMContentLoaded', async () => {
            const subscriptionId = await fetchInitialData();
            if (subscriptionId) {
                listenForUpdates(subscriptionId);
            }
        });
    </script>
</head>
<body>
<h1>Dynamic Image Update with Subscription</h1>
<img id="liveImage" alt="Dynamic Image">
</body>
</html>
```