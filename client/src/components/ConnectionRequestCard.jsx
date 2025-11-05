import axios from "axios";
import React, { useState } from "react";
import BASE_URL from "../config/baseurl";

const ConnectionRequestCard = ({ userData, reqId, onReview }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = userData;
  const requestId = reqId;

  const [showRequest, setShowRequest] = useState(true);

  const handleReviewRequest = async (status, id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + id,
        {},
        { withCredentials: true }
      );
      setShowRequest(false);
    } catch (error) {
      console.log("Axios Error: ", error);
      console.log("Error Message: " + error?.response?.data?.msg);
    }
  };
  return (
    showRequest && (
      <div className="flex justify-center py-4">
        <div className="w-1/2 card bg-base-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt={`${firstName} ${lastName}`}
                    src={photoUrl}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="card-title text-xl">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-sm text-base-content/70 mb-2">
                    {age} years old • {gender}
                  </p>
                )}
                <p className="text-sm line-clamp-2">{about}</p>
              </div>
              <div className="card-actions flex gap-4">
                <button
                  className="btn btn-accent btn-sm"
                  onClick={() => onReview("accepted", requestId)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => onReview("rejected", requestId)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ConnectionRequestCard;
