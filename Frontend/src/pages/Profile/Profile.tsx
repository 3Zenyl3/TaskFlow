import "./Profile.css";
import DashboardLeftSide from "../../components/Dashboard/DashboardLeftSide/DashboardLeftSide";
import { HiOutlineMail } from "react-icons/hi";
import {
  HiOutlinePencil,
  HiOutlineCalendarDays,
  HiOutlineUser,
} from "react-icons/hi2";
import { useProfile } from "../../hooks/useProfile";
import { useState } from "react";
import { PatchProfile } from "../../api/profile";
import { NavLink } from "react-router-dom";

function Profile() {
  const { profile, loading, error, refetch } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  if (loading) {
    return <div>Загрузка профиля...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Профиль не найден</div>;
  }

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Некорректная дата';

    return date.toLocaleDateString('ru-RU');
  };
  async function handleSave() {
    try {
      await PatchProfile({
        userName,
        avatarUrl,
        description
      });

      setIsEditing(false);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="profile">
      <DashboardLeftSide />

      <main className="profileContent">
        <div className="profileHeaderTop">
          <NavLink to="/dashboard"><h2 className="backToProjects">{'<'} Главная</h2></NavLink>
          <span>/</span>
          <h2 className="currentProjectName">Профиль</h2>
        </div>

        <section className="profileHeader">

          <div className="profileMainInfo">

            {isEditing ? (
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="URL аватарки"
              />
            ) : (
              <div className="profileAvatar">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} />
                ) : (
                  profile.userName.slice(0, 2).toUpperCase()
                )}
              </div>
            )}

            <div className="profileNameBlock">
              {isEditing ? (
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              ) : (
                <h1>{profile.userName}</h1>
              )}

              <h2>{profile?.role}</h2>

              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Расскажите о себе"
                  rows={4}
                />
              ) : (
                <p>
                  {profile.description}
                </p>
              )}
            </div>

          </div>
          {isEditing ? (
            <button className="editProfileButton"
              onClick={() => {
                handleSave();
              }}
            >
              <HiOutlinePencil />
              Сохранить
            </button>
          ) : (
            <button className="editProfileButton"
              onClick={() => {
                setUserName(profile.userName);
                setAvatarUrl(profile.avatarUrl ?? "");
                setDescription(profile.description ?? "");
                setIsEditing(true);
              }}
            >
              <HiOutlinePencil />
              Редактировать профиль
            </button>
          )}


          <div className="profileMeta">

            <div className="profileMetaItem">
              <HiOutlineMail />
              <span>{profile?.email}</span>
            </div>

            <div className="profileMetaItem">
              <HiOutlineCalendarDays />
              <span>Присоединился {profile && formatDateTime(profile.createdAt)}</span>
            </div>

          </div>

        </section>

        <section className="profileCard">

          <h2>Обо мне</h2>

          <p className="aboutText">
            {profile.description}
          </p>

          <div className="profileDivider" />

          <div className="profileDetails">

            <div className="detailItem">
              <HiOutlineUser />

              <div>
                <span>Роль</span>
                <strong>{profile.role}</strong>
              </div>
            </div>

          </div>

        </section>

        <section className="profileCard contactsCard">

          <h2>Контакты</h2>

          <div className="contacts">

            <div className="detailItem">
              <HiOutlineMail />

              <div>
                <span>Email</span>
                <strong>{profile?.email}</strong>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Profile;