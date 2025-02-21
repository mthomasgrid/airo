"use client";
import styles from "@/components/Header/HeaderComponent.module.css";
import profileImage from "@/assets/images/default-profile.png";
import Image from "next/image";
import { logo } from "@/assets/images/logo";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { isPanelShowSelector } from "@/redux/selectors/isPanelShowSelector";
import { showPanel } from "@/redux/slice/isPanelOpen";
import { authErrorSelector, authUserSelector } from "@/redux/selectors/authSelector";
import { useEffect, useState } from "react";
import { showToast } from "@/redux/slice/toastSlice";
import { resetError } from "@/redux/slice/authSlice";

import Search from "@/components/search/SearchComponent";

export default function Header() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setIsButtonClicked(!isButtonClicked);
  };

  const dispatch = useDispatch<AppDispatch>();
  const isPanelShow = useSelector(isPanelShowSelector);
  const currentUser = useSelector(authUserSelector);
  const error = useSelector(authErrorSelector);

  useEffect(() => {
    if (error) {
      dispatch(showToast({ message: error as string, type: "error" }));
      dispatch(resetError());
    }
  }, [error, dispatch]);

  return (
    <header className={styles.header} data-testid="header-component">
      <div className={styles.head} data-testid="header-logo">
        {logo}
      </div>
      <div className={styles.searchBar} data-testid="search-bar">
        <div className={styles.searchBar__button} data-testid="search-bar-button">
          <p className={styles.clasterization} data-testid="clasterization-text">
            Voronoi clasterization
          </p>
          <div
            className={
              isButtonClicked
                ? `${styles.btnOuter} ${styles.active}`
                : styles.btnOuter
            }
            onClick={handleButtonClick}
            data-testid="toggle-button"
          >
            <div
              className={
                isButtonClicked
                  ? `${styles.btnInner} ${styles.moveRight}`
                  : styles.btnInner
              }
              data-testid="toggle-button-inner"
            ></div>
          </div>
        </div>
        <Search data-testid="search-component" />
        {/* <div className={styles.search}>
          {searchIcon}
          <input
            type="text"
            placeholder="Type address..."
            className={styles.input}
            data-testid="search-input"
          />
          {searchBar}
        </div> */}
      </div>
      <div className={styles.dashboard} data-testid="dashboard">
        <div data-testid="notification-icon">
          <svg
            width="24"
            height="21"
            viewBox="0 0 24 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-testid="notification-svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.3 8.75C18.3 5.19823 16.2855 2.73308 13.6789 1.993C13.5845 1.75557 13.4353 1.53484 13.2326 1.34963C12.5398 0.716791 11.4603 0.716791 10.7675 1.34963C10.5652 1.53443 10.4162 1.75459 10.3218 1.99143C7.71183 2.72826 5.7 5.18804 5.7 8.75C5.7 11.0547 5.22208 12.3461 4.33736 13.2819C4.18944 13.4384 3.78867 13.7968 3.51719 14.0396L3.51716 14.0397L3.51694 14.0399C3.38862 14.1546 3.28923 14.2435 3.25917 14.273L3 14.5285V17.5123H8.47918C8.66445 18.4416 9.18308 19.0633 10.121 19.6198C11.2747 20.3043 12.7253 20.3043 13.879 19.6198C14.7067 19.1287 15.2617 18.374 15.4869 17.5123H21V14.5285L20.7408 14.273C20.7135 14.2461 20.6181 14.1604 20.4933 14.0485C20.2227 13.8058 19.814 13.4393 19.6638 13.2798C18.7785 12.3396 18.3 11.0466 18.3 8.75ZM13.563 17.5123H10.3608C10.4879 17.7423 10.7046 17.9159 11.0586 18.126C11.6366 18.4689 12.3634 18.4689 12.9414 18.126C13.2091 17.9672 13.4182 17.757 13.563 17.5123ZM18.3362 14.4615C18.5255 14.6626 18.9315 15.0303 19.2 15.2704V15.7623H4.8V15.2708C5.06646 15.0335 5.47359 14.6661 5.66264 14.4661C6.8648 13.1945 7.5 11.4781 7.5 8.75C7.5 5.44241 9.59949 3.51083 12 3.51083C14.3937 3.51083 16.5 5.45238 16.5 8.75C16.5 11.4693 17.1354 13.1863 18.3362 14.4615Z"
              fill="white"
            />
          </svg>
        </div>

        <div
          className={styles.profile}
          onClick={() => dispatch(showPanel(!isPanelShow))}
          data-testid="profile-container"
        >
          <Image
            src={currentUser?.photoURL ? currentUser.photoURL : profileImage}
            alt="profileImg"
            height={40}
            width={40}
            className={styles.profileImg}
            data-testid="profile-img"
          />
          <p data-testid="profile-name">
            {currentUser?.displayName ? currentUser.displayName : "Guest"}
          </p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-testid="dropdown-icon"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.04469 10.2934C8.12576 10.1147 8.30382 10 8.50001 10H15.5C15.6962 10 15.8743 10.1147 15.9553 10.2934C16.0364 10.472 16.0055 10.6816 15.8763 10.8293L12.3763 14.8293C12.2814 14.9378 12.1442 15 12 15C11.8558 15 11.7187 14.9378 11.6237 14.8293L8.12372 10.8293C7.99453 10.6816 7.96362 10.472 8.04469 10.2934Z"
              fill="#C4C4C4"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}