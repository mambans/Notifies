import React from "react";

import { SubFeedContainer } from "./../../sharedStyledComponents";
import LoadingBoxs from "./../LoadingBoxs";
import { SubFeedHeader } from "./StyledComponents";

export default ({ numberOfVideos }) => {
  return (
    <>
      <SubFeedHeader
        style={{
          width: `${numberOfVideos * 350}px`,
        }}>
        <h3>Clips</h3>
      </SubFeedHeader>

      <SubFeedContainer
        style={{ justifyContent: "center", minHeight: "310px", paddingBottom: "0" }}>
        <LoadingBoxs amount={numberOfVideos} type='Clips' />
      </SubFeedContainer>
    </>
  );
};