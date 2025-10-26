
var video;
var img;
var imgOut; // Grayscale + Brightened
var imgEdge; // Edge detection filter
var imgRed, imgGreen, imgBlue; // RGB color channels
var imgRedThresh, imgGreenThresh, imgBlueThresh; // RGB threshold images
var imgCMYK, imgHSV; // Color space conversion images
var imgCMYKThresh, imgHSVThresh; // Threshold color space images

var redSlider, greenSlider, blueSlider; // Sliders for RGB threshold
var cmykSlider, hsvSlider; // Sliders for color space threshold
var slidersCreated = false; // Track if sliders exist
var w = 400;
var h = 300;
var detector;
var classifier = objectdetect.frontalface;
var img;
var faces;
let faceDetectionImg;
var grayscaleImg; // Grayscale version of the image
var blurredImg; // Blurred version of the image
var colorConvImg;
let pixelatedImg;
var displayState = 0; // 0: original, 1: grayscale, 2: blurred, 3: colorConv, 4: pixelated

function setup() {
  createCanvas(800, 1500); // Canvas size to accommodate all images
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(190, 150);
  video.hide();

  var scaleFactor = 1.2;
  detector = new objectdetect.detector(w, h, scaleFactor, classifier);
  faceImg = createImage(w, h);
}

function draw() {
  background(220);

  // Instruction text at the top of the canvas
  fill(0);
  textSize(15);
  textAlign(CENTER);
  text("Press W to capture images", width/2, 25);
  text("Press K to toggle between face detection filters", width/2, 45);

  // First row
  image(video, 50, 50, 180, 200); // Webcam image
  if (imgOut) {
    image(imgOut, 250, 50, 180, 200); // Grayscale + brightened image
    if (imgEdge) {
      image(imgEdge, 450, 50, 180, 200); // Edge detection image
    }
  }

  // Second row
  if (imgRed) {
    image(imgRed, 50, 280, 180, 200); // Red channel
  }

  if (imgGreen) {
    image(imgGreen, 250, 280, 180, 200); // Green channel
  }

  if (imgBlue) {
    image(imgBlue, 450, 280, 180, 200); // Blue channel
  }

  // Third row - Threshold images
  if (imgRedThresh && imgGreenThresh && imgBlueThresh) {
    image(imgRedThresh, 50, 510, 180, 200); // Thresholded Red
    image(imgGreenThresh, 250, 510, 180, 200); // Thresholded Green
    image(imgBlueThresh, 450, 510, 180, 200); // Thresholded Blue
  }

  // Fourth row - Color Space Conversions
  if (imgCMYK) {
    image(video, 50, 740, 180, 200); // Repeat webcam image
    image(imgCMYK, 250, 740, 180, 200); // CMYK Color Space
    image(imgHSV, 450, 740, 180, 200); // HSV Color Space
  }

  // Fifth row - Static face detection image
  if (faceDetectionImg) {
    if (displayState === 0) {
      image(faceDetectionImg, 50, 970, 180, 200); // Original image
    } else if (displayState === 1) {
      image(grayscaleImg, 50, 970, 180, 200); // Grayscale image
    } else if (displayState === 2) {
      image(blurredImg, 50, 970, 180, 200); // Blurred image
    } else if (displayState === 3) {
      image(colorConvImg, 50, 970, 180, 200); // colorconv image
    } else if (displayState === 4) {
      image(pixelatedImg, 50, 970, 180, 200); // pixelated image
    }
  } else {
    // If not available yet, show video
    image(video, 50, 970, 180, 200);
  }

  if (imgCMYKThresh && imgHSVThresh) {
    image(imgCMYKThresh, 250, 970, 180, 200);
    image(imgHSVThresh, 450, 970, 180, 200);
  }
}

function keyPressed() {
  if (key === "k" || key === "K") {
    // Toggle display state
    displayState = (displayState + 1) % 5; // Cycle through 0, 1, 2, 3, 4
  }
  if (key === "w" || key === "W") {
    img = video.get();
    img.resize(160, 120);

    // Create output images
    imgOut = createImage(img.width, img.height);
    imgEdge = createImage(img.width, img.height);
    imgRed = createImage(img.width, img.height);
    imgGreen = createImage(img.width, img.height);
    imgBlue = createImage(img.width, img.height);

    imgRedThresh = createImage(img.width, img.height);
    imgGreenThresh = createImage(img.width, img.height);
    imgBlueThresh = createImage(img.width, img.height);

    // Color space conversion images
    imgCMYK = createImage(img.width, img.height);
    imgHSV = createImage(img.width, img.height);

    // Color space threshold images
    imgCMYKThresh = createImage(img.width, img.height);
    imgHSVThresh = createImage(img.width, img.height);

    img.loadPixels();
    imgOut.loadPixels();
    imgEdge.loadPixels();
    imgRed.loadPixels();
    imgGreen.loadPixels();
    imgBlue.loadPixels();
    imgRedThresh.loadPixels();
    imgGreenThresh.loadPixels();
    imgBlueThresh.loadPixels();
    imgCMYK.loadPixels();
    imgHSV.loadPixels();
    imgCMYKThresh.loadPixels();
    imgHSVThresh.loadPixels();

    // Process pixels
    for (var y = 0; y < img.height; y++) {
      for (var x = 0; x < img.width; x++) {
        var index = (x + y * img.width) * 4;

        var r = img.pixels[index] / 255;
        var g = img.pixels[index + 1] / 255;
        var b = img.pixels[index + 2] / 255;

        var rRaw = img.pixels[index];
        var gRaw = img.pixels[index + 1];
        var bRaw = img.pixels[index + 2];

        // Convert to grayscale luminance formula
        var gray = 0.299 * rRaw + 0.587 * gRaw + 0.114 * bRaw;
        gray = Math.min(gray * 1.2, 255); // Increase brightness by 20%

        // Grayscale pixels
        imgOut.pixels[index] = gray;
        imgOut.pixels[index + 1] = gray;
        imgOut.pixels[index + 2] = gray;
        imgOut.pixels[index + 3] = 255;

        // Red channel
        imgRed.pixels[index] = rRaw;
        imgRed.pixels[index + 1] = 0;
        imgRed.pixels[index + 2] = 0;
        imgRed.pixels[index + 3] = 255;

        // Green channel
        imgGreen.pixels[index] = 0;
        imgGreen.pixels[index + 1] = gRaw;
        imgGreen.pixels[index + 2] = 0;
        imgGreen.pixels[index + 3] = 255;

        // Blue channel
        imgBlue.pixels[index] = 0;
        imgBlue.pixels[index + 1] = 0;
        imgBlue.pixels[index + 2] = bRaw;
        imgBlue.pixels[index + 3] = 255;

        // RGB to CMYK Conversion
        let black = Math.min(1 - r, 1 - g, 1 - b);
        let cyan = black === 1 ? 0 : (1 - r - black) / (1 - black);
        let magenta = black === 1 ? 0 : (1 - g - black) / (1 - black);
        let yellow = black === 1 ? 0 : (1 - b - black) / (1 - black);

        imgCMYK.pixels[index] = cyan * 255;
        imgCMYK.pixels[index + 1] = magenta * 255;
        imgCMYK.pixels[index + 2] = yellow * 255;
        imgCMYK.pixels[index + 3] = 255;

        // RGB to HSV Conversion
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let delta = max - min;

        let h = 0;
        if (delta !== 0) {
          if (max === r) {
            h = 60 * (((g - b) / delta) % 6);
          } else if (max === g) {
            h = 60 * ((b - r) / delta + 2);
          } else if (max === b) {
            h = 60 * ((r - g) / delta + 4);
          }
        }
        if (h < 0) h += 360;

        let s = max === 0 ? 0 : delta / max;
        let v = max;

        imgHSV.pixels[index] = (h / 360) * 255;
        imgHSV.pixels[index + 1] = s * 255;
        imgHSV.pixels[index + 2] = v * 255;
        imgHSV.pixels[index + 3] = 255;
      }
    }

    // Grayscale copy for edge detection processing
    let grayImg = createImage(img.width, img.height);
    grayImg.loadPixels();
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        let index = (x + y * img.width) * 4;
        let r = img.pixels[index];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];
        
        // Convert to grayscale
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        grayImg.pixels[index] = gray;
        grayImg.pixels[index + 1] = gray;
        grayImg.pixels[index + 2] = gray;
        grayImg.pixels[index + 3] = 255;
      }
    }
    grayImg.updatePixels();

    // Sobel edge detection
    for (let y = 1; y < img.height - 1; y++) {
      for (let x = 1; x < img.width - 1; x++) {
        let index = (x + y * img.width) * 4;
        
        // Get 3x3 neighborhood for Sobel operator
        let tl = grayImg.pixels[((x-1) + (y-1) * img.width) * 4];
        let t  = grayImg.pixels[((x)   + (y-1) * img.width) * 4];
        let tr = grayImg.pixels[((x+1) + (y-1) * img.width) * 4];
        let l  = grayImg.pixels[((x-1) + (y)   * img.width) * 4];
        let r  = grayImg.pixels[((x+1) + (y)   * img.width) * 4];
        let bl = grayImg.pixels[((x-1) + (y+1) * img.width) * 4];
        let b  = grayImg.pixels[((x)   + (y+1) * img.width) * 4];
        let br = grayImg.pixels[((x+1) + (y+1) * img.width) * 4];
        
        // Sobel operators
        let sobelX = (tr + 2*r + br) - (tl + 2*l + bl);
        let sobelY = (bl + 2*b + br) - (tl + 2*t + tr);
        
        // Magnitude
        let magnitude = Math.sqrt(sobelX*sobelX + sobelY*sobelY);
        
        // Normalize and threshold
        magnitude = map(magnitude, 0, 255, 0, 255);
        let edgeValue = magnitude > 25 ? 255 : 0; // Threshold value
        
        // Apply to edge image with a color tint (yellow)
        imgEdge.pixels[index] = edgeValue;        // R 
        imgEdge.pixels[index + 1] = edgeValue;    // G 
        imgEdge.pixels[index + 2] = 0;            // B no blue makes it yellow
        imgEdge.pixels[index + 3] = 255;
      }
    }

    // Update images
    imgOut.updatePixels();
    imgEdge.updatePixels();
    imgRed.updatePixels();
    imgGreen.updatePixels();
    imgBlue.updatePixels();
    imgCMYK.updatePixels();
    imgHSV.updatePixels();

    // Initial threshold
    applyThresholding(128, 128, 128);
    applyColorThresholding(128, 128);

    // Remove existing sliders if they exist
    if (slidersCreated) {
      redSlider.remove();
      greenSlider.remove();
      blueSlider.remove();
      cmykSlider.remove();
      hsvSlider.remove();
    }

    // RGB sliders
    redSlider = createSlider(0, 255, 128);
    redSlider.position(50, 710);
    redSlider.input(() =>
      applyThresholding(
        redSlider.value(),
        greenSlider.value(),
        blueSlider.value()
      )
    );

    greenSlider = createSlider(0, 255, 128);
    greenSlider.position(250, 710); 
    greenSlider.input(() =>
      applyThresholding(
        redSlider.value(),
        greenSlider.value(),
        blueSlider.value()
      )
    );

    blueSlider = createSlider(0, 255, 128);
    blueSlider.position(450, 710); 
    blueSlider.input(() =>
      applyThresholding(
        redSlider.value(),
        greenSlider.value(),
        blueSlider.value()
      )
    );

    // Color space sliders
    cmykSlider = createSlider(0, 255, 128);
    cmykSlider.position(250, 1170); 
    cmykSlider.input(() =>
      applyColorThresholding(cmykSlider.value(), hsvSlider.value())
    );

    hsvSlider = createSlider(0, 255, 128);
    hsvSlider.position(450, 1170);
    hsvSlider.input(() =>
      applyColorThresholding(cmykSlider.value(), hsvSlider.value())
    );

    slidersCreated = true;

    // Face detection data for the current frame
    faceImg = createImage(w, h);
    faceImg.copy(video, 0, 0, video.width, video.height, 0, 0, w, h);
    let faces = detector.detect(faceImg.canvas);

    faceDetectionImg = createImage(img.width, img.height);
    faceDetectionImg.copy(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      img.width,
      img.height
    );

    grayscaleImg = createImage(img.width, img.height);
    grayscaleImg.copy(
      faceDetectionImg,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      img.width,
      img.height
    );

    // Blurred version
    blurredImg = createImage(img.width, img.height);
    blurredImg.copy(
      faceDetectionImg,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      img.width,
      img.height
    );

    // Color conversion version
    colorConvImg = createImage(img.width, img.height);
    colorConvImg.copy(
      faceDetectionImg,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      img.width,
      img.height
    );

    pixelatedImg = createImage(img.width, img.height);
    pixelatedImg.copy(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      img.width,
      img.height
    );

    if (faces && faces.length > 0) {
      let bestFace = faces.reduce((prev, current) => {
        let prevArea = prev[2] * prev[3];
        let currentArea = current[2] * current[3];
        return prevArea > currentArea ? prev : current;
      });

      // Scaling of coordinates to match the image size
      let scaleX = img.width / w;
      let scaleY = img.height / h;

      let x = Math.floor(bestFace[0] * scaleX);
      let y = Math.floor(bestFace[1] * scaleY);
      let width = Math.ceil(bestFace[2] * scaleX);
      let height = Math.ceil(bestFace[3] * scaleY);

      // Making sure coordinates stay within bounds
      x = constrain(x, 0, img.width - 1);
      y = constrain(y, 0, img.height - 1);
      width = constrain(width, 1, img.width - x);
      height = constrain(height, 1, img.height - y);

      // Red rectangle border on original
      let ctxOrig = faceDetectionImg.canvas.getContext("2d");
      ctxOrig.strokeStyle = "red";
      ctxOrig.lineWidth = 2;
      ctxOrig.strokeRect(x, y, width, height);

      //Grayscale - process pixels directly in the face region
      grayscaleImg.loadPixels();
      for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
          let index = (px + py * grayscaleImg.width) * 4;
          let r = grayscaleImg.pixels[index];
          let g = grayscaleImg.pixels[index + 1];
          let b = grayscaleImg.pixels[index + 2];

          // Grayscale conversion using luminance formula
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;

          grayscaleImg.pixels[index] = gray;
          grayscaleImg.pixels[index + 1] = gray;
          grayscaleImg.pixels[index + 2] = gray;
        }
      }
      grayscaleImg.updatePixels();

      // Draw rectangle on grayscale
      let ctxGray = grayscaleImg.canvas.getContext("2d");
      ctxGray.strokeStyle = "red";
      ctxGray.lineWidth = 2;
      ctxGray.strokeRect(x, y, width, height);

      // 2. BLUR temporary PGraphics to process just the face region
      let pgBlur = createGraphics(width, height);
      pgBlur.copy(img, x, y, width, height, 0, 0, width, height);
      pgBlur.filter(BLUR, 3); // Blur the face region

      // Copy only the blurred face region back to the main image
      blurredImg.copy(pgBlur, 0, 0, width, height, x, y, width, height);

      // Draw rectangle on blurred
      let ctxBlur = blurredImg.canvas.getContext("2d");
      ctxBlur.strokeStyle = "red";
      ctxBlur.lineWidth = 2;
      ctxBlur.strokeRect(x, y, width, height);

      // 3. CMYK color conversion - process pixels directly in the face region
      colorConvImg.loadPixels();
      for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
          let index = (px + py * colorConvImg.width) * 4;

          let r = colorConvImg.pixels[index] / 255;
          let g = colorConvImg.pixels[index + 1] / 255;
          let b = colorConvImg.pixels[index + 2] / 255;

          // RGB to CMYK conversion
          let black = Math.min(1 - r, 1 - g, 1 - b);
          let cyan = black === 1 ? 0 : (1 - r - black) / (1 - black);
          let magenta = black === 1 ? 0 : (1 - g - black) / (1 - black);
          let yellow = black === 1 ? 0 : (1 - b - black) / (1 - black);

          colorConvImg.pixels[index] = cyan * 255;
          colorConvImg.pixels[index + 1] = magenta * 255;
          colorConvImg.pixels[index + 2] = yellow * 255;
        }
      }
      colorConvImg.updatePixels();

      // Rectangle on color conversion
      let ctxColor = colorConvImg.canvas.getContext("2d");
      ctxColor.strokeStyle = "red";
      ctxColor.lineWidth = 2;
      ctxColor.strokeRect(x, y, width, height);

      // Pixelation - apply to face region only
      const BLOCK_SIZE = 5; // 5x5 pixel blocks

      // Creating a temporary grayscale copy of the face region
      let tempFaceRegion = createImage(width, height);
      tempFaceRegion.copy(img, x, y, width, height, 0, 0, width, height);
      tempFaceRegion.loadPixels();

      // Convert to grayscale first
      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          let index = (px + py * width) * 4;
          let r = tempFaceRegion.pixels[index];
          let g = tempFaceRegion.pixels[index + 1];
          let b = tempFaceRegion.pixels[index + 2];

          // Convert to grayscale
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;

          tempFaceRegion.pixels[index] = gray;
          tempFaceRegion.pixels[index + 1] = gray;
          tempFaceRegion.pixels[index + 2] = gray;
        }
      }
      tempFaceRegion.updatePixels();

      // Apply pixelation in blocks
      for (let blockY = 0; blockY < height; blockY += BLOCK_SIZE) {
        for (let blockX = 0; blockX < width; blockX += BLOCK_SIZE) {
          // Calculate block dimensions
          let blockW = min(BLOCK_SIZE, width - blockX);
          let blockH = min(BLOCK_SIZE, height - blockY);

          // Average intensity for block
          let totalIntensity = 0;
          let pixelCount = 0;

          for (let py = 0; py < blockH; py++) {
            for (let px = 0; px < blockW; px++) {
              let index = ((blockY + py) * width + (blockX + px)) * 4;
              totalIntensity += tempFaceRegion.pixels[index]; // Just red channel
              pixelCount++;
            }
          }

          let avgIntensity =
            pixelCount > 0 ? Math.floor(totalIntensity / pixelCount) : 0;

          // Fill block with the average intensity
          for (let py = 0; py < blockH; py++) {
            for (let px = 0; px < blockW; px++) {
              let index = ((blockY + py) * width + (blockX + px)) * 4;
              tempFaceRegion.pixels[index] = avgIntensity;
              tempFaceRegion.pixels[index + 1] = avgIntensity;
              tempFaceRegion.pixels[index + 2] = avgIntensity;
            }
          }
        }
      }
      tempFaceRegion.updatePixels();

      // Copy pixelated face region back to the main image
      pixelatedImg.copy(
        tempFaceRegion,
        0,
        0,
        width,
        height,
        x,
        y,
        width,
        height
      );

      // Rectangle on pixelated
      let ctxPixel = pixelatedImg.canvas.getContext("2d");
      ctxPixel.strokeStyle = "red";
      ctxPixel.lineWidth = 2;
      ctxPixel.strokeRect(x, y, width, height);
    }
  }
}

function applyThresholding(redThreshold, greenThreshold, blueThreshold) {
  if (!imgRed || !imgGreen || !imgBlue) return;

  imgRedThresh.loadPixels();
  imgGreenThresh.loadPixels();
  imgBlueThresh.loadPixels();

  for (var y = 0; y < imgRed.height; y++) {
    for (var x = 0; x < imgRed.width; x++) {
      var index = (x + y * imgRed.width) * 4;

      var r = imgRed.pixels[index];
      var g = imgGreen.pixels[index + 1];
      var b = imgBlue.pixels[index + 2];

      // Apply thresholding
      imgRedThresh.pixels[index] = r > redThreshold ? 255 : 0;
      imgRedThresh.pixels[index + 1] = 0;
      imgRedThresh.pixels[index + 2] = 0;
      imgRedThresh.pixels[index + 3] = 255;

      imgGreenThresh.pixels[index] = 0;
      imgGreenThresh.pixels[index + 1] = g > greenThreshold ? 255 : 0;
      imgGreenThresh.pixels[index + 2] = 0;
      imgGreenThresh.pixels[index + 3] = 255;

      imgBlueThresh.pixels[index] = 0;
      imgBlueThresh.pixels[index + 1] = 0;
      imgBlueThresh.pixels[index + 2] = b > blueThreshold ? 255 : 0;
      imgBlueThresh.pixels[index + 3] = 255;
    }
  }

  imgRedThresh.updatePixels();
  imgGreenThresh.updatePixels();
  imgBlueThresh.updatePixels();
}

function applyColorThresholding(cmykThreshold, hsvThreshold) {
  if (!imgCMYK || !imgHSV) return;

  imgCMYKThresh.loadPixels();
  imgHSVThresh.loadPixels();

  for (var y = 0; y < imgCMYK.height; y++) {
    for (var x = 0; x < imgCMYK.width; x++) {
      var index = (x + y * imgCMYK.width) * 4;

      // Cyan value from CMYK image for thresholding
      var cyanValue = imgCMYK.pixels[index];

      // Hue value from HSV image for thresholding
      var hueValue = imgHSV.pixels[index];

      // Binary thresholding for CMYK (using cyan component)
      var cmykResult = cyanValue > cmykThreshold ? 255 : 0;
      imgCMYKThresh.pixels[index] = cmykResult; // R
      imgCMYKThresh.pixels[index + 1] = cmykResult; // G
      imgCMYKThresh.pixels[index + 2] = cmykResult; // B
      imgCMYKThresh.pixels[index + 3] = 255; // A

      // Binary thresholding for HSV (using hue component)
      var hsvResult = hueValue > hsvThreshold ? 255 : 0;
      imgHSVThresh.pixels[index] = hsvResult; // R
      imgHSVThresh.pixels[index + 1] = hsvResult; // G
      imgHSVThresh.pixels[index + 2] = hsvResult; // B
      imgHSVThresh.pixels[index + 3] = 255; // A
    }
  }

  imgCMYKThresh.updatePixels();
  imgHSVThresh.updatePixels();
}