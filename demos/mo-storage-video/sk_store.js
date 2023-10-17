function store_signIn() {
  let { signInAnonymously, auth } = fb_;
  signInAnonymously(auth)
    .then(() => {
      console.log('signInAnonymously OK');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('errorCode', errorCode);
      console.log('errorMessage', errorMessage);
    });
}

// https://firebase.google.com/docs/storage/web/upload-files?authuser=0#upload_from_a_blob_or_file

function store_upload() {
  console.log('store_upload');

  canvas.toBlob(
    (blob) => {
      store_upload_blob(blob);
    },
    my.type,
    my.quality
  ); // JPEG at 95% quality
}

function default_imagePath() {
  return `${my.rootPath}/${fb_.auth.currentUser.uid}/001${my.ext}`;
}
function store_upload_blob(blob) {
  console.log('store_upload_blob', blob);
  let { storage, ref, uploadBytes } = fb_;

  // let path = `/-mo-1/${fb_.auth.currentUser.uid}/000`;
  my.imagePath = default_imagePath();
  console.log('store_upload_blob my.imagePath', my.imagePath);
  const storageRef = ref(storage, my.imagePath);

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, blob)
    .then((snapshot) => {
      console.log('snapshot.metadata.fullPath', snapshot.metadata.fullPath);
      // console.log('snapshot', snapshot);
      // console.log('Uploaded path', path);
    })
    .catch((error) => {
      // Handle any errors
      console.log('store_upload_blob error', error);
    });
}

// https://stackoverflow.com/questions/38004917/how-to-render-a-blob-on-a-canvas-element
// HTMLCanvasElement.prototype.renderImage = function(blob) {

function renderBlobToCanvas(blob) {
  let canvas = my.canvas.elt;
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(blob);
}

function store_getDownloadURL(path) {
  console.log('store_getDownloadURL path', path);
  if (!path) {
    path = default_imagePath();
    console.log('store_getDownloadURL default_imagePath', path);
  }
  let { storage, ref, getDownloadURL } = fb_;
  // getDownloadURL(ref(storage, 'GNhzoQknS1OHY8DA1Fvygmltr902/1.jpeg'))
  getDownloadURL(ref(storage, path))
    // oVFxc052pOWF5qq560qMuBmEsbr2/120.jpeg
    // oVFxc052pOWF5qq560qMuBmEsbr2/119.jpeg
    .then((url) => {
      // `url` is the download URL for '1.jpeg'
      console.log('store_getDownloadURL url', url);

      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
        console.log('store_getDownloadURL blob', blob);
        renderBlobToCanvas(blob);
      };
      xhr.open('GET', url);
      xhr.send();

      // Or inserted into an <img> element
      // const img = document.getElementById('myimg');
      let img = createImg(url, 'img test');
      // img.setAttribute('src', url);
    })
    .catch((error) => {
      // Handle any errors
      console.log('store_getDownloadURL error', error);
    });
}

// https://firebase.google.com/docs/storage/web/list-files#list_all_files
function store_listAll(bucket) {
  console.log('store_listAll bucket', bucket);
  let { storage, ref, listAll } = fb_;
  // Create a reference under which you want to list
  // const listRef = ref(storage, 'oVFxc052pOWF5qq560qMuBmEsbr2');
  // const listRef = ref(storage, '');
  const listRef = ref(storage, bucket);
  console.log('listRef', listRef);
  // Find all the prefixes and items.
  listAll(listRef)
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
        // console.log('folderRef', folderRef);
        // console.log('folderRef.path', folderRef.path); // Defined
        // console.log('bucket', folderRef.bucket);
        console.log('prefix fullPath', folderRef.fullPath);
      });
      res.items.forEach((itemRef) => {
        // All the items under listRef.
        // console.log('itemRef', itemRef);
        console.log('item fullPath', itemRef.fullPath);
      });
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.log('store_listAll error', error);
    });
}

// https://firebase.google.com/docs/storage/web/list-files#paginate_list_results
function store_list(bucket) {
  console.log('store_list bucket', bucket);
  let { storage, ref, list } = fb_;
  // Create a reference under which you want to list
  // const listRef = ref(storage, 'oVFxc052pOWF5qq560qMuBmEsbr2');
  // const listRef = ref(storage, '');
  const listRef = ref(storage, bucket);
  console.log('listRef', listRef);
  // Find all the prefixes and items.
  list(listRef, { maxResults: 100 })
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
        // console.log('folderRef', folderRef);
        // console.log('folderRef.path', folderRef.path); // Defined
        // console.log('bucket', folderRef.bucket);
        console.log('prefix fullPath', folderRef.fullPath);
      });
      res.items.forEach((itemRef) => {
        // All the items under listRef.
        // console.log('itemRef', itemRef);
        console.log('item fullPath', itemRef.fullPath);
      });
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.log('store_list error', error);
      d_error = error;
    });
}
