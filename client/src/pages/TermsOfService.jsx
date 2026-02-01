import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TermsOfService = () => {
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
                <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                <p className="text-gray-400 mb-8">Last updated: February 1, 2026</p>

                <div className="space-y-8">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-300 leading-relaxed">
                            By accessing and using Ledgerly ("the Service"), you accept and agree to be bound by the terms and
                            provisions of this agreement. If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    {/* Description of Service */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Ledgerly is a link management platform that allows you to:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Save and organize your favorite links</li>
                            <li>Categorize links with custom tags</li>
                            <li>Access your links from any device</li>
                            <li>Share links with others</li>
                        </ul>
                    </section>

                    {/* User Accounts */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Account Creation</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    You may create an account using email/password or through third-party authentication
                                    (Google, GitHub). You are responsible for maintaining the confidentiality of your account credentials.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Account Security</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    You are responsible for all activities that occur under your account. Please notify us immediately
                                    of any unauthorized use of your account.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Account Termination</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    You may delete your account at any time from your profile settings. We reserve the right to
                                    suspend or terminate accounts that violate these terms.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* User Conduct */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. User Conduct</h2>
                        <p className="text-gray-300 mb-4">You agree NOT to use the Service to:</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>Upload, post, or transmit any illegal, harmful, or offensive content</li>
                            <li>Violate any laws or regulations</li>
                            <li>Infringe on intellectual property rights of others</li>
                            <li>Distribute spam, malware, or phishing links</li>
                            <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                            <li>Interfere with or disrupt the Service or servers</li>
                            <li>Use automated tools to scrape or collect data from the Service</li>
                        </ul>
                    </section>

                    {/* Content Ownership */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Content Ownership</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Your Content</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    You retain all rights to the links, notes, and other content you create on Ledgerly.
                                    By using the Service, you grant us a license to store and display your content as necessary
                                    to provide the Service.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-white mb-2">Our Content</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    The Service, including its design, features, and functionality, is owned by Ledgerly and
                                    is protected by copyright and other intellectual property laws.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Service Availability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Service Availability</h2>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            We strive to provide reliable service, but we do not guarantee that:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                            <li>The Service will be uninterrupted or error-free</li>
                            <li>Defects will be corrected immediately</li>
                            <li>The Service will be available at all times</li>
                        </ul>
                        <p className="text-gray-300 leading-relaxed mt-4">
                            We reserve the right to modify, suspend, or discontinue the Service at any time with or without notice.
                        </p>
                    </section>

                    {/* Free Tier Limitations */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Free Tier Limitations</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Ledgerly is currently offered as a free service. We may introduce usage limits, premium features,
                            or paid plans in the future. Users will be notified of any changes in advance.
                        </p>
                    </section>

                    {/* Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Privacy</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Your use of the Service is also governed by our{' '}
                            <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                                Privacy Policy
                            </Link>
                            . Please review it to understand how we collect, use, and protect your information.
                        </p>
                    </section>

                    {/* Disclaimer of Warranties */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Disclaimer of Warranties</h2>
                        <p className="text-gray-300 leading-relaxed">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                            WE DO NOT WARRANT THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR BE SUITABLE FOR YOUR PURPOSES.
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. Limitation of Liability</h2>
                        <p className="text-gray-300 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, LEDGERLY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
                            DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES.
                        </p>
                    </section>

                    {/* Indemnification */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">11. Indemnification</h2>
                        <p className="text-gray-300 leading-relaxed">
                            You agree to indemnify and hold harmless Ledgerly from any claims, damages, losses, liabilities,
                            and expenses arising from your use of the Service or violation of these terms.
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to Terms</h2>
                        <p className="text-gray-300 leading-relaxed">
                            We reserve the right to modify these terms at any time. We will notify users of any material changes
                            by posting the new terms on this page and updating the "Last updated" date. Your continued use of
                            the Service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
                        <p className="text-gray-300 leading-relaxed">
                            These terms shall be governed by and construed in accordance with the laws of your jurisdiction,
                            without regard to its conflict of law provisions.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="border-t border-white/10 pt-8">
                        <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Information</h2>
                        <p className="text-gray-300 leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us at:{' '}
                            <a href="mailto:khushangsingh.work@gmail.com" className="text-blue-400 hover:text-blue-300">
                                khushangsingh.work@gmail.com
                            </a>
                        </p>
                    </section>

                    {/* Acceptance */}
                    <section className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                        <p className="text-gray-300 leading-relaxed">
                            By using Ledgerly, you acknowledge that you have read, understood, and agree to be bound by these
                            Terms of Service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
