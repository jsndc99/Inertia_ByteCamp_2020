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
    if (!isNaN(detections.alignedRect._box.x)) {
      const item = {

        ...detections.expressions,
        timestamp: timestamp,
        name: 'Elvis',
        headPose: HeadGazeDetect(detections)
      }
      OUTPUT.push(item)
    }


  return OUTPUT
}


async function FaceRecognitionGetMatcherFromDescription(existing, input,  max_face_distance_euclidean = 1.0) {
  const userFaceMatcher = await new faceapi.FaceMatcher(existing, max_face_distance_euclidean)
  const bestMatch = userFaceMatcher.findBestMatch(input)
  window.location.href = "localhost:3000/course.html"
  console.log("best match is.....", bestMatch.toString())
  return bestMatch

}

async function fetchId(userFaceDescription){
  var labels = []
  res = await fetch("/api/getDescriptor");
  res.json().then(data=>{
    data.forEach(rows =>{
    labels.push(new faceapi.LabeledFaceDescriptors(rows.name, [
      new Float32Array(rows.description.descriptor)
    ]))
    
  })
  
  console.log(labels)
  FaceRecognitionGetMatcherFromDescription(labels, userFaceDescription.descriptor)
  })
}