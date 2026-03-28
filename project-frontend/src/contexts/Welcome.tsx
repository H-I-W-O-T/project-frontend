import * as React from 'react';
import { Button } from '../shared/components/Common/Button';
import { useNavigate } from 'react-router-dom';

// You can import images to use in the welcome page if you have them in assets
// import hiwotLogo from '../assets/hiwot-logo.png';

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-primary-light to-primary-cyan p-8">
      {/* Left Side: Registration Button */}
      <div className="flex flex-col items-center md:items-start md:w-1/3 mb-8 md:mb-0">
        <Button
          size="lg"
          className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-8 transition-all duration-200"
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
      </div>
      {/* Right Side: Welcome Content */}
      <div className="bg-white bg-opacity-90 rounded-xl shadow-xl p-8 max-w-2xl w-full md:w-2/3">
        {/* <img src={hiwotLogo} alt="Hiwot Logo" className="w-24 mb-4 mx-auto" /> */}
        <h1 className="text-4xl font-extrabold text-primary-dark mb-4 text-center md:text-left">Welcome to Hiwot</h1>
        <h2 className="text-xl font-semibold text-primary mb-4 text-center md:text-left">The Humanitarian Aid Coordination Protocol</h2>
        <ul className="list-decimal list-inside text-lg text-gray-700 mb-6">
          <li><b>Beneficiary:</b> A displaced person in need of aid.</li>
          <li><b>Aid Organization:</b> UN, NGO, or local group providing supplies or cash.</li>
          <li><b>Donor:</b> An entity funding the aid, wanting to see its impact.</li>
          <li><b>Hiwot Protocol:</b> The automated system of smart contracts on the Stellar blockchain.</li>
        </ul>
        <p className="text-md text-gray-700 mb-4">
          Hiwot is a transparent, privacy-preserving protocol for humanitarian aid. It uses blockchain and zero-knowledge proofs to ensure that aid is delivered efficiently, fairly, and with full accountability—while protecting the privacy of beneficiaries.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex flex-col items-center">
            <img src="/public/hiwot-actors.png" alt="Hiwot Actors" className="w-40 h-40 object-contain rounded-lg shadow" />
            <span className="text-sm text-gray-600 mt-2">Hiwot's Four Main Actors</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/public/hiwot-flow.png" alt="Hiwot Protocol Flow" className="w-40 h-40 object-contain rounded-lg shadow" />
            <span className="text-sm text-gray-600 mt-2">Protocol Step-by-Step</span>
          </div>
        </div>
        <p className="text-md text-gray-700 mt-6">
          <b>How it works:</b> Organizations onboard, register beneficiaries, define aid programs, and track supply chains—all on-chain. Beneficiaries claim aid using privacy-preserving biometrics. Donors and the public can audit the process, ensuring transparency and impact.
        </p>
      </div>
    </div>
  );
};
