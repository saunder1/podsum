const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg');

// Check if FFmpeg is installed
if (!ffmpeg) {
  console.error('FFmpeg is not installed. Please install it first.');
  process.exit(1);
}

function splitMp3(inputFile, outputDir, segmentDuration) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  ffmpeg.ffprobe(inputFile, (err, metadata) => {
    if (err) {
      console.error('Error while reading input file:', err);
      return;
    }

    const duration = metadata.format.duration;
    let currentSegment = 0;
    let segmentStart = 0;

    while (segmentStart < duration) {
      const outputFileName = path.join(outputDir, `segment-${currentSegment}.mp3`);
      ffmpeg(inputFile)
        .setStartTime(segmentStart)
        .setDuration(segmentDuration)
        .output(outputFileName)
        .on('error', (err) => {
          console.error('Error while creating segment:', err);
        })
        .on('end', () => {
          console.log(`Segment ${currentSegment} saved as ${outputFileName}`);
        })
        .run();

      currentSegment++;
      segmentStart += segmentDuration;
    }
  });
}

// Usage: node split-mp3.js <inputFile> <outputDir> [segmentDuration]
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node split-mp3.js <inputFile> <outputDir> [segmentDuration]');
  process.exit(1);
}

const inputFile = args[0];
const outputDir = args[1];
const segmentDuration = args[2] ? parseInt(args[2], 10) : 600; // Default to 600 seconds (10 minutes)

splitMp3(inputFile, outputDir, segmentDuration);
