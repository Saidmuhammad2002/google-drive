import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

export default function Folder({ folder }) {
  return (
    <Button
      variant="outline-dark"
      as={Link}
      to={`/folder/${folder?.id}`}
      state={{ folder: folder }}
      className="text-truncate w-100"
    >
      <FontAwesomeIcon icon={faFolder} className="me-2" />
      {folder?.name}
    </Button>
  );
}
