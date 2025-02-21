import { useDispatch } from "react-redux";
import styles from "./OnBoardingComponent.module.css";
import Image from "next/image";
import { AppDispatch } from "@/redux/store";
import { toggleOnboardPopup } from "@/redux/slice/isOnBoarding";





export default function OnBoardingComponent(){
    const dispatch = useDispatch<AppDispatch>();

    const closeOnBoarding = () => {
       dispatch(toggleOnboardPopup(false));
    }



    return(
        <>
            <section className={styles.onboarding}>

                <div className={styles.crossLine}>
                    <Image src="/icons/Xline.svg" alt="Close" width={72} height={35} onClick={closeOnBoarding}/>
                </div>
                <div className={styles.onboardingLogoContent}>
                    <div className={styles.onboardingLogo}>
                        <Image src="/icons/Logo.svg" alt="Logo" width={82} height={22}/>
                        <p className={styles.logoContent}>by Grid Dynamic</p>
                    </div>
                    <Image src="/icons/Goto.svg" alt="Goto" width={82} height={22}/>
                </div>


                <div className={styles.onboardingInfo}>
                    <article className={styles.onboardingTitle}>
                        Hi there!
                    </article>
                    <article className={styles.onboardingContent}>Let us introduce the AIRO by Grid Dynamics – 
                        the application’s ready to share with you the overall and parametrical <br />
                        information about the air condition in the selected area. </article>
                    <article className={styles.onboardingContent}>It is the platform for collaboration. 
                        Users could add their own devices 
                        to share air condition statistics in their areas with other people.</article>
                    <article className={styles.onboardingContent}>The goal of the application is to highlight the
                        condition of our common environment and think 
                        about where we are now and what we would 
                        bring to new generations.</article>
                </div>

                <div className={styles.onboardingBtn}>
                    <button className={styles.onboardingBtnContent} onClick={closeOnBoarding}>Ok, got it!</button>
                </div>



            </section>
        
        
        
        
        
        </>
    )
}