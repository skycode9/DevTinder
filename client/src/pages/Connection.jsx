import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../config/baseurl";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import ConnectionCard from "../components/ConnectionCard";

const Connection = () => {
  const connections = useSelector((store) => store.connection);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/view/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      console.log("Axios Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!connections) {
    return (
      <h1 className="text-center my-10 text-2xl font-bold">Data not found.!</h1>
    );
  }

  if (connections.length == 0) {
    return (
      <h1 className="text-center my-10 text-2xl font-bold">
        Connection Data Not Found..!
      </h1>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">My Connections</h1>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {connections.map((connection, index) => {
            return <ConnectionCard key={index} connection={connection} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Connection;
