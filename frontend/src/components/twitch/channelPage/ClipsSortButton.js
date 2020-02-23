import React, { useState } from "react";
import { MdSort } from "react-icons/md";

import { SortButton, SortDropDownList } from "./StyledComponents";

export default ({ sortBy, setSortBy, setData }) => {
  const [open, setOpen] = useState(false);
  const SortOptionsNames = {
    "3": "3 days",
    "7": "1 week",
    "14": "2 weeks",
    "30": "1 month",
    "90": "3 months",
    "180": "6 months",
    "360": "1 year",
    null: "Lifetime",
  };
  return (
    <>
      <SortButton
        onClick={() => {
          setOpen(!open);
        }}>
        <MdSort size={30} />
        Within: {SortOptionsNames[sortBy || "null"]}
      </SortButton>
      {open ? (
        <SortDropDownList>
          {Object.keys(SortOptionsNames).map(option => {
            return (
              <li
                key={option}
                onClick={() => {
                  setData();
                  setSortBy(option === "null" ? null : option);
                  setOpen(false);
                }}>
                {SortOptionsNames[option]}
              </li>
            );
          })}
        </SortDropDownList>
      ) : null}
    </>
  );
};