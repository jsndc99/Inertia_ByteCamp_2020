function FaceDetectionSetup() {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ])
}

function DetectAllFaceDescriptionWithLandmarksAndDescription(img) {
  return faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
}
function DetectSingleFaceDescriptionWithLandmarksAndDescription(img) {
  return faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
}
function DetectSingleFaceDescriptionWithLandmarksAndDescriptionWithoutExpression(img) {
  console.log("Wait...........")
  return faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

}

async function DetectAllFaces(input, timestamp) {
  const detections = await DetectSingleFaceDescriptionWithLandmarksAndDescription(input);
  console.log(detections)
  let OUTPUT = []
  let zero = {neutral: 0,
  happy: 0,
  sad: 0,
  angry: 0,
  fearful:0,
  disgusted: 0,
  surprised: 0}
    if(detections)
    {
      if (!isNaN(detections.alignedRect._box.x)) {
        const item = {
          ...detections.expressions,
          timestamp: timestamp,
          name: 'Princeton',
          headPose: HeadGazeDetect(detections)
        }
        OUTPUT.push(item)
      }
      
    }
    else{
      const item = {
        ...zero,
        timestamp: timestamp,
        name : 'Princeton',
        headPose: HeadGazeDetect(detections)
      }
      OUTPUT.push(item)
    }
    
  return OUTPUT
}






