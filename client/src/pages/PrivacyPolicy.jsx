import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300">
            {/* Header */}
            <div className="border-b border-white/5 bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                        <FaArrowLeft className="text-sm" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: February 1, 2026</p>

                <div className="space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Welcome to Ledgerly. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy will inform you about how we handle your personal data when you use our service.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Account Information</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                    <li>Email address (for account creation and communication)</li>
                                    <li>Username (chosen by you or from OAuth provider)</li>
                                    <li>Profile information from Google or GitHub (if you sign in with OAuth)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Content You Create</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                    <li>Links you save and organize</li>
                                    <li>Categories and tags you create</li>
                                    <li>Notes and descriptions you add to links</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Usage Information</h3>
                                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                                    <li>Browser type and version</li>
                                    <li>Device information</li>
                                    <li>IP address (for security purposes)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
                        <p className="text-gray-300 mb-4">We use your information to:</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Provide and maintain our service</li>
                            <li>Authenticate your account and keep it secure</li>
                            <li>Send you important updates about the service</li>
                            <li>Improve and optimize our platform</li>
                            <li>Respond to your support requests</li>
                        </ul>
                    </section>

                    {/* Data Storage and Security */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Data Storage and Security</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Your data is stored securely using industry-standard encryption. We use MongoDB Atlas for database hosting
                            and implement security best practices including password hashing, secure authentication tokens, and HTTPS encryption.
                        </p>
                    </section>

                    {/* What We Don't Do */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">What We Don't Do</h2>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>We do NOT sell your personal data to third parties</li>
                            <li>We do NOT share your data with advertisers</li>
                            <li>We do NOT use your data for advertising purposes</li>
                            <li>We do NOT track you across other websites</li>
                        </ul>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
                        <p className="text-gray-300 mb-4">We use the following third-party services:</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li><strong>Google OAuth:</strong> For Google sign-in (subject to Google's Privacy Policy)</li>
                            <li><strong>GitHub OAuth:</strong> For GitHub sign-in (subject to GitHub's Privacy Policy)</li>
                            <li><strong>MongoDB Atlas:</strong> For secure data storage</li>
                            <li><strong>Vercel:</strong> For hosting our frontend</li>
                            <li><strong>Render:</strong> For hosting our backend</li>
                        </ul>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
                        <p className="text-gray-300 mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Access your personal data</li>
                            <li>Update or correct your information</li>
                            <li>Delete your account and all associated data</li>
                            <li>Export your data</li>
                            <li>Opt-out of communications</li>
                        </ul>
                        <p className="text-gray-300 mt-4">
                            You can delete your account at any time from your profile settings. This will permanently remove all your data.
                        </p>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Cookies and Local Storage</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We use local storage to keep you logged in and remember your preferences. We do not use tracking cookies
                            or third-party analytics cookies.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Children's Privacy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Our service is not intended for children under 13 years of age. We do not knowingly collect personal
                            information from children under 13.
                        </p>
                    </section>

                    {/* Changes to Policy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We may update this privacy policy from time to time. We will notify you of any changes by posting the
                            new privacy policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="border-t border-white/10 pt-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                        <p className="text-gray-300 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:{' '}
                            <a href="mailto:khushangsingh.work@gmail.com" className="text-blue-400 hover:text-blue-300">
                                khushangsingh.work@gmail.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
