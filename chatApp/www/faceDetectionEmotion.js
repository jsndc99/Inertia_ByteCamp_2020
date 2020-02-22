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
  const description = faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
  const labelDescriptors = [
    new faceapi.LabeledFaceDescriptors(
      1,
      [description]
    )
  ]
}
async function DetectAllFaces(input, timestamp) {
  const detections = await DetectSingleFaceDescriptionWithLandmarksAndDescription(input);
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
        personId: ,
        headPose: HeadGazeDetect(detections)
      }
      OUTPUT.push(item)
    }


  return OUTPUT
}

// async function FaceRecognitionGetMatcherFromImage(userFace, max_face_distance_euclidean = 0.6) {
//   const userFaceDescription = await DetectSingleFaceDescriptionWithLandmarksAndDescription(userFace)
//   return FaceRecognitionWithDescription(userFaceDescription, max_face_distance_euclidean);
// }
async function FaceRecognitionGetMatcherFromDescription(labelDescription, max_face_distance_euclidean = 0.6) {
  const userFaceMatcher = await new faceapi.FaceMatcher(labelDescription, max_face_distance_euclidean);
  console.log("prici;;;",userFaceMatcher)
  return userFaceMatcher;
}

async function FaceRecognition(input, userFaceMatcher) {
  const inputFaceDescriptions = await DetectSingleFaceDescriptionWithLandmarksAndDescriptionWithoutExpression(input)
  for (const fd of inputFaceDescriptions) {
    const bestMatch = userFaceMatcher.findBestMatch(fd.descriptor)
    console.log(bestMatch.toString())
  }
}