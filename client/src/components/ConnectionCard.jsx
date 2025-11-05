import React from "react";

const ConnectionCard = ({ connection }) => {
  const { firstName, lastName, photoUrl, age, gender, about } = connection;
  return (
    <div>
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
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
            <div className="card-actions">
              <button className="btn btn-primary btn-sm">Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
