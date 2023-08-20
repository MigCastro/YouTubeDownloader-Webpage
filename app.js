const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

// Serve the frontend files from the "public" directory
app.use(express.static('public'));

app.get('/download', async (req, res) => {
  const videoUrl = req.query.videoUrl;
  const type = req.query.type;

  if (!videoUrl || !type) {
    return res.json({ success: false, message: 'Invalid request parameters.' });
  }

  try {
    // Get video info
    const videoInfo = await ytdl.getInfo(videoUrl);

    if (!videoInfo) {
      return res.json({ success: false, message: 'Error fetching video information.' });
    }

    // Handle different download types
    if (type === 'video') {
      // Choose the video format with H.264/AVC and AAC codecs
      const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
        format: 'mp4',
        quality: 'highestvideo',
        filter: 'videoandaudio',
      });

      if (!videoFormat) {
        return res.json({ success: false, message: 'No suitable video format found.' });
      }

      // Get the video title and remove any invalid characters from the filename
      const videoTitle = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');

      // Set the appropriate Content-Disposition header to trigger the download
      res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);

      // Stream the video to the response
      ytdl(videoUrl, { format: videoFormat }).pipe(res);
    } else if (type === 'audio') {
      // Choose the audio format
      const audioFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioonly' });

      if (!audioFormat) {
        return res.json({ success: false, message: 'No suitable audio format found.' });
      }

      // Get the video title and remove any invalid characters from the filename
      const videoTitle = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');

      // Set the appropriate Content-Disposition header to trigger the download
      res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp3"`); // Change the file extension to mp3 for audio

      // Stream the audio to the response
      ytdl(videoUrl, { format: audioFormat }).pipe(res);
    }
  } catch (error) {
    console.error('Error while fetching video information:', error);
    return res.json({ success: false, message: 'Error while fetching video information.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
