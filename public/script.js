
document.addEventListener('DOMContentLoaded', function () {
    const downloadForm = document.getElementById('downloadForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const typeSelect = document.getElementById('type');
  
    downloadForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const videoUrl = videoUrlInput.value;
      const type = typeSelect.value;
  
      if (!videoUrl) {
        console.error('Video URL is empty.');
        return;
      }
  
      let downloadType = 'video';
      if (type === 'audio') {
        downloadType = 'audio';
      }
  
      const downloadUrl = `/download?videoUrl=${encodeURIComponent(videoUrl)}&type=${encodeURIComponent(downloadType)}`;
      window.location.href = downloadUrl;
    });
  });
  