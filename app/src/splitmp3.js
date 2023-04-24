const fs = require('fs');
const MediaSplit = require('media-split');

// Change this to the path of your input MP3 file
const inputFilePath = 'test.mp3';

// Change this to the directory where you want to save the output files
const outputDirectory = 'splits';

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

var media;

fs.readFile(inputFilePath, (err, data) => {
  if (err) {
    console.error("Error reading the mp3 file:", err);
    return;
  }

  media = new MediaSplit(data);
});


const segmentDuration = 10 * 60; // 10 minutes in seconds

media.splitByDuration(segmentDuration, (err, segments) => {
  if (err) {
    console.error("Error splitting the mp3 file:", err);
    return;
  }

  // Save the segments to separate files
  segments.forEach((segment, index) => {
    const outputPath = `splits/segment${index + 1}.mp3`;
    fs.writeFile(outputPath, segment, (err) => {
      if (err) {
        console.error("Error writing the mp3 segment:", err);
        return;
      }

      console.log(`Segment ${index + 1} saved to ${outputPath}`);
    });
  });
});


