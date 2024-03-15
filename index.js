const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function processImageAndUpload(buffer) {
    try {
        const base64String = Buffer.from(buffer, 'binary').toString('base64');

        const apiResponse = await axios.post('https://www.drawever.com/api/photo-to-anime', {
            data: `data:image/png;base64,${base64String}`,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const processedImageUrls = apiResponse.data.urls.map(url => 'https://www.drawever.com' + url);

        return processedImageUrls;
    } catch (error) {
        throw error;
    }
}

app.get('/draw', async (req, res) => {
    try {
        const imageUrl = req.query.imgurl;

        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });

        const processedImageUrls = await processImageAndUpload(imageResponse.data);

        res.json({ processedImageUrls });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
