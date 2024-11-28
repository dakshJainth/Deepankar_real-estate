import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserSuccess,
  updateUserFailure,
  updateUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  signOutUserSuccess,
  signOutUserFailure,
  signOutUserStart,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [file, setFile] = useState(null);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uplaodTask = uploadBytesResumable(storageRef, file);

    uplaodTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uplaodTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);

      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
     
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      const newListings = userListings.filter((listing) => listing._id !== listingId);
      setUserListings(newListings);

      // setUserListings((prev) =>
      //   prev.filter((listing) => listing._id !== listingId)
      // );

      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt=""
          className="h-24 w-24 rounded-full object-cover hover:cursor-pointer self-center"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-600">Error image upload</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span>{`uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-400">successfully uploaded</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          name=""
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg "
          onChange={handleChange}
        />

        <input
          type="email"
          defaultValue={currentUser.email}
          name="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg "
          onChange={handleChange}
        />

        <input
          type="text"
          name=""
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg "
        />

        <button className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
          update
        </button>
        <Link
          className="bg-green-700 text-white uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80 text-center"
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>

      <div className="flex justify-between my-6">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-green-500 mt-5">
        {updateSuccess ? "Successfully updated" : ""}
      </p>

      <button onClick={handleShowListings} className="text-green-700 w-full">
        show listings
      </button>

      <p className="text-red-700 mt-5">
        {showListingsError ? "error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div>
          <h1 className="text-center my-8 text-3xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="border rounded-lg p-3 m-3 flex justify-between items-center"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>

                <Link
                  className='"font-semibold text-slate-700 hover:text-slate-500 truncate flex-1"'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col">
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    delete
                  </button>
                  <Link to={`/edit-listing/${listing._id}`}>
                  <button className="text-yellow-600 uppercase">edit</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
