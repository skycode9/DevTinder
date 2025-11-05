import axios from "axios";
import React from "react";
import BASE_URL from "../config/baseurl";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ userFeed, showButtons = true }) => {
  const { _id, firstName, lastName, about, age, gender, photoUrl } = userFeed;
  const dispatch = useDispatch();
  const handleSendRequest = async (status, id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + id,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(id));
    } catch (error) {
      console.log("Axios Error: " + error);
      console.log("Error Message: " + error?.response?.data?.msg);
    }
  };

  return (
    <div className="flex justify-center items-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <figure>
          <img src={photoUrl} alt="Shoes" className="w-[65%]" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {firstName} {lastName}
          </h2>
          <h2>{age && age}</h2>
          <h2>{gender && gender}</h2>
          <p>{about}</p>
          {showButtons && (
            <div className="card-actions justify-end">
              <button
                className="btn btn-primary"
                onClick={() => handleSendRequest("interested", _id)}
              >
                Interested
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleSendRequest("ignored", _id)}
              >
                Ignored
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
