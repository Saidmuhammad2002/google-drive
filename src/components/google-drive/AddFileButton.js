import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { database, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import { v4 as uuidV4 } from "uuid";
import { ProgressBar, Toast } from "react-bootstrap";
import { getDocs } from "firebase/firestore";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();
  function handleUpload(e) {
    const file = e.target.files[0];
    if (currentFolder == null || file == null) return;
    const id = uuidV4();
    setUploadingFiles((prevUploadingFiles) => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false },
    ]);
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.map((f) => f.name).join("/")}/${file.name}`
        : `${currentFolder.path.map((f) => f.name).join("/")}/${
            currentFolder.name
          }/${file.name}`;

    const storageRef = ref(storage, `/files/${currentUser.uid}/${filePath}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id)
              return { ...uploadFile, progress: progress };
            return uploadFile;
          });
        });
      },
      () =>
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) return { ...uploadFile, error: true };
            return uploadFile;
          });
        }),
      () => {
        setUploadingFiles((prevUploadingFiles) => {
          return prevUploadingFiles.filter(
            (uploadFile) => uploadFile.id !== id
          );
        });

        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          getDocs(
            database.preventFromDuplicate(
              file.name,
              currentUser.uid,
              currentFolder.id
            )
          ).then((existingFiles) => {
            const existingFile = existingFiles.docs[0];
            if (existingFile)
              database.updateFile(existingFile.id, {
                url: url,
              });
            else
              return database.addFile({
                url: url,
                name: file.name,
                createdAt: database.getCurrentTimeStamp(),
                folderId: currentFolder.id,
                userId: currentUser.uid,
              });
          });
        });
      }
    );
  }
  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 me-2">
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map((file) => (
              <Toast
                key={file.id}
                className="text-truncate w-100 d-block"
                onClose={() =>
                  setUploadingFiles((prevUploadingFiles) => {
                    return prevUploadingFiles.filter(
                      (uploadFile) => uploadFile.id !== file.id
                    );
                  })
                }
              >
                <Toast.Header closeButton={file.error}>
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    variant={file.error ? "danger" : "primary"}
                    animated={!file.error}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
