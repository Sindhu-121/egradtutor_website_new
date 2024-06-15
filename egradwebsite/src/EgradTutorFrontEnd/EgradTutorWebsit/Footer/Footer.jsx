import React from "react";
import PricingandRefundPolicy from "../WebsiteSubPages/PricingAndRefundPolicyPage/PricingandRefundPolicy";
import PrivacyPolicy from "../WebsiteSubPages/PrivacyPolicyPage/PrivacyPolicy";
import TermsAndCondetions from "../WebsiteSubPages/TermsAndConditionsPage/TermsAndCondetions";
import FAQ from "../WebsiteSubPages/FAQPage/FAQ";

const Footer = () => {
  return (
    <div>
      Footer
      <PrivacyPolicy />
      <PricingandRefundPolicy />
      <TermsAndCondetions />
      <FAQ />
   
    </div>
  );
};

export default Footer;
