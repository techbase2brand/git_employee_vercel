import React, { useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ViewprojectTable from "./ViewProjectTable";
import { GlobalInfo } from "../App";

const ViewProject: React.FC = () => {
  const { projEditObj, setProjEditObj } = useContext(GlobalInfo);

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >

        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>

          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-container"
          >
            <div
            >
              <p
                className="mrng-tas"
              >
                Project List
              </p>
              <ViewprojectTable
                projEditObj={projEditObj}
                setProjEditObj={setProjEditObj}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ViewProject;
