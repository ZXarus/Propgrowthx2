import React, { useEffect, useState } from "react";
import axios from "axios";

interface Profile {
  id: string;
  email: string;
  role: string;
  name: string;
  emer_contact?: string;
  profile_image?: string;
  s_link1?: string;
  s_link2?: string;
  s_link3?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [emerContact, setEmerContact] = useState("");
  const [name, setName] = useState("");
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [s3, setS3] = useState("");

  const token = sessionStorage.getItem("token");

  // fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:XXXX/api/profile/profileDetails",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(res.data);
      setEmerContact(res.data.emer_contact || "");
      setS1(res.data.s_link1 || "");
      setS2(res.data.s_link2 || "");
      setS3(res.data.s_link3 || "");
    } catch (err) {
      console.error("Fetch profile error", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateImage = async () => {
    if (!image || !profile) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.patch(
        `http://localhost:XXXX/api/profile/update_pic/${profile.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile image updated");
      fetchProfile();
    } catch (err) {
      console.error("Update image error", err);
    }
  };

  // update details
  const updateDetails = async () => {
    if (!profile) return;

    try {
      await axios.patch(
        `http://localhost:XXXX/api/profile/update_details/${profile.id}`,
        {
          emer_contact: emerContact,
          name: name,
          s_link1: s1,
          s_link2: s2,
          s_link3: s3,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated");
      fetchProfile();
    } catch (err) {
      console.error("Update details error", err);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile Page</h2>

      <p>Role: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>

      {profile.profile_image && (
        <img src={profile.profile_image} alt="profile" width={150} />
      )}

      <div>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <button onClick={updateImage}>Update Profile Image</button>
      </div>

      <hr />

      <div>
        <input
          type="text"
          placeholder="Emergency Contact"
          value={emerContact}
          onChange={(e) => setEmerContact(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Social Link 1"
          value={s1}
          onChange={(e) => setS1(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Social Link 2"
          value={s2}
          onChange={(e) => setS2(e.target.value)}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Social Link 3"
          value={s3}
          onChange={(e) => setS3(e.target.value)}
        />
      </div>

      <button onClick={updateDetails}>Update Profile Details</button>
    </div>
  );
};

export default ProfilePage;
