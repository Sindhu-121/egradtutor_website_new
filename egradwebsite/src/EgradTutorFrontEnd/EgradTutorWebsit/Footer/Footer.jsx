import React from "react";
import PricingandRefundPolicy from "../WebsiteSubPages/PricingAndRefundPolicyPage/PricingandRefundPolicy";
import PrivacyPolicy from "../WebsiteSubPages/PrivacyPolicyPage/PrivacyPolicy";
import TermsAndCondetions from "../WebsiteSubPages/TermsAndConditionsPage/TermsAndCondetions";
import FAQ from "../WebsiteSubPages/FAQPage/FAQ";
import ContactUs from "../WebsiteSubPages/ContactUsPage/ContactUs";

const Footer = () => {
  return (
    <div>
      Footer
      <PrivacyPolicy />
      <PricingandRefundPolicy />
      <TermsAndCondetions />
      <FAQ />
      <ContactUs/>
    </div>
  );
};

export default Footer;
