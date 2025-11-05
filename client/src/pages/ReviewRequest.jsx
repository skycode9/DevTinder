import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../config/baseurl";
import ConnectionRequestCard from "../components/ConnectionRequestCard";

const ReviewRequest = () => {
  const [connectionRequest, setConnectionrequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      setConnectionrequest(res?.data?.connectionRequest);
    } catch (error) {
      console.log("Axios Error: " + error);
      console.log("Error Message" + error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReviewRequest = async (status, requestId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      // Remove the reviewed request from the state
      setConnectionrequest((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    } catch (error) {
      console.log("Axios Error: " + error);
      console.log(
        "Error Message:" + error?.response?.data?.msg || error.message
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!connectionRequest) return <h1>No Request Found..!</h1>;

  if (connectionRequest.length === 0) {
    return (
      <h1 className="flex justify-center py-4 text-2xl font-semibold">
        No Request Found
      </h1>
    );
  }

  return (
    connectionRequest && (
      <div>
        {connectionRequest.map((connectionRequest, index) => {
          return (
            <ConnectionRequestCard
              userData={connectionRequest.fromUserId}
              reqId={connectionRequest._id}
              key={connectionRequest._id}
              onReview={handleReviewRequest}
            />
          );
        })}
      </div>
    )
  );
};

export default ReviewRequest;
