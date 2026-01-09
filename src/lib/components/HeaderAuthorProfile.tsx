interface Props {
  profile: Author | null;
}

export default function HeaderAuthorProfile({ profile }: Props) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      <p>{profile ? profile.full_name : "אורח"}</p>
      <br />
      <p>{profile && profile.email}</p>
      {!!profile && <img src={profile.avatar_url} height={50} width={50}></img>}
    </div>
  );
}
