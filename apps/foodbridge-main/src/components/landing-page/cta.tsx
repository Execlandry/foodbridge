import React from "react";

function CallToAction() {
    return (
        <section className="bg-green-500 py-16 px-6 sm:px-10 lg:px-20 text-white">
            <div className="max-w-5xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Be a Part of the Change
                </h2>
                <p className="text-lg mb-8">
                    Whether you're a donor, volunteer, or organization—your involvement
                    makes a difference. Let's eliminate food waste together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() =>
                        (window.location.href = "http://localhost:3007/signin")
                    } className="px-6 py-3 bg-white text-green-600 font-semibold rounded-md shadow-md hover:bg-gray-100 transition-all">
                        Donate Food
                    </button>
                    <button className="px-6 py-3 border border-white font-semibold rounded-md hover:bg-white hover:text-green-600 transition-all">
                        Join as Volunteer
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CallToAction;
