import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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

const Profile: React.FC = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [emerContact, setEmerContact] = useState("");
  const [s1, setS1] = useState("");
  const [s2, setS2] = useState("");
  const [s3, setS3] = useState("");

  const fetchProfile = async (profileId: any) => {
    if (!profileId) return;

    try {
      const res = await axios.get(
        `http://localhost:6876/api/auth/profileDetails/${profileId}`,
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

  useEffect(() => {
    if (profileId) {
      fetchProfile(profileId);
    }
  }, [profileId]);

  if (!profile) return <div>Loading...</div>;

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
      <p>
        {" "}
        <b>Name:</b>
        {name}
      </p>

      {profile.profile_image ? (
        <img src={profile.profile_image} alt="profile" width={150} />
      ) : (
        <p>no profile image</p>
      )}

      <p>
        {" "}
        <b>Emergency contact:</b>
        {emerContact ? emerContact : "no contact"}
      </p>

      <p>
        {" "}
        <b>link 1:</b>
        {s1 ? s1 : "no link"}
      </p>
      <p>
        {" "}
        <b>link 2:</b>
        {s2 ? s2 : "no link"}
      </p>
      <p>
        {" "}
        <b>link 3:</b>
        {s3 ? s3 : "no link"}
      </p>
    </div>
  );
};

export default Profile;
