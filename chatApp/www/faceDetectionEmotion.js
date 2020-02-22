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
  // let numPersons = detections.length
  // for (let i = 0; i < numPersons; i++) {
    if (!isNaN(detections.alignedRect._box.x)) {
      const item = {
        // ...detections[i].alignedRect._box,
        // ...detections[i].alignedRect._box,
        ...detections.expressions,
        timestamp: timestamp,
        // numPerson: numPersons,
        personId: 1,
        headPose: HeadGazeDetect(detections)
      }
      OUTPUT.push(item)
    }


  return OUTPUT
}


async function FaceRecognitionGetMatcherFromDescription(existing, input,  max_face_distance_euclidean = 0.6) {
  const userFaceMatcher = await new faceapi.FaceMatcher(existing, max_face_distance_euclidean);
  const bestMatch = userFaceMatcher.findBestMatch(input)
  console.log("best match is.....",bestMatch.toString())
  return bestMatch

}

async function fetchId(userFaceDescription){
  res = await fetch("/api/getDescriptor");
  res.json().then(data=>{
    console.log("Data is.........................", data)
    FaceRecognitionGetMatcherFromDescription(data, userFaceDescription.descriptor)
        
      })


}