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

// Configure the media splitter
const split = new MediaSplit({input: inputFilePath, sections: ['[10:00] Split']});
split.parse().then((sections) => {
  for (let section of sections) {
    console.log(section.name);
  }
})

