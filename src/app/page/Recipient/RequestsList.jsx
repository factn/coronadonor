import React from "react";

export default function ({ missions }) {
  return <p>{JSON.stringify(missions, null, 2)}</p>;
}
