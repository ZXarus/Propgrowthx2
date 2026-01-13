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
  const token = sessionStorage.getItem("token");

  const [profileId, setProfileId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [emerContact, setEmerContact] = useState("");
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [s3, setS3] = useState("");

  const getAccess = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:6876/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unauthorized");
      }

      console.log(data.user);

      setProfileId(data.user.id);
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const fetchProfile = async (profileId: string) => {
    if (!profileId) return;

    try {
      const res = await axios.get(
        `http://localhost:6876/api/auth/profileDetails/${profileId}`
      );

      const data = res.data.profile;

      setProfile(data);
      setName(data?.name ?? "");
      setEmerContact(data?.emer_contact ?? "");
      setS1(data?.s_link1 ?? "");
      setS2(data?.s_link2 ?? "");
      setS3(data?.s_link3 ?? "");
    } catch (error) {
      console.error("Fetch profile error:", error);
    }
  };

  const updateImage = async () => {
    if (!image || !profile) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.patch(
        `http://localhost:6876/api/auth/update_pic/${profile.id}`,
        formData
      );

      alert("Profile image updated");
      fetchProfile(profile.id);
    } catch (err) {
      console.error("Update image error:", err);
    }
  };

  const updateDetails = async () => {
    if (!profile) return;

    try {
      await axios.patch(
        `http://localhost:6876/api/auth/update_details/${profile.id}`,
        {
          name,
          emer_contact: emerContact,
          s_link1: s1,
          s_link2: s2,
          s_link3: s3,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated");
      fetchProfile(profile.id);
    } catch (err) {
      console.error("Update details error:", err);
    }
  };

  useEffect(() => {
    getAccess();
  }, [token]);

  useEffect(() => {
    if (profileId) {
      fetchProfile(profileId);
    }
  }, [profileId]);

  if (!profile) return <div>Loading...</div>;
  console.log(profile);

  return (
    <div>
      <h2>Profile Page</h2>

      <p>
        <b>Name:</b> {profile.name}
      </p>
      <p>
        <b>Email:</b> {profile.email}
      </p>
      <p>
        <b>Role:</b> {profile.role}
      </p>

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

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Emergency Contact"
        value={emerContact}
        onChange={(e) => setEmerContact(e.target.value)}
      />

      <input
        type="text"
        placeholder="Social Link 1"
        value={s1}
        onChange={(e) => setS1(e.target.value)}
      />

      <input
        type="text"
        placeholder="Social Link 2"
        value={s2}
        onChange={(e) => setS2(e.target.value)}
      />

      <input
        type="text"
        placeholder="Social Link 3"
        value={s3}
        onChange={(e) => setS3(e.target.value)}
      />

      <button onClick={updateDetails}>Update Profile Details</button>
    </div>
  );
};

export default ProfilePage;
