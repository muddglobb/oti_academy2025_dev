import React from "react";
import EnrolledClass from "./enrolled-class";


const SecondContent = async () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left Column */}
      <EnrolledClass />

      {/* Right Column */}
      <div className="col-span-1">
        {/* Calendar */}
        <div className="border-2 border-neutral-500 rounded-[20px] p-5 mb-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-neutral-500">
            <h3 className="font-medium">July 2025</h3>
            <button className="bg-blue-600 text-white text-xs rounded px-2 py-1">
              No class
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
            <div className="text-[var(--color-primary-100)]">M</div>
            <div className="text-[var(--color-primary-100)]">T</div>
            <div className="text-[var(--color-primary-100)]">W</div>
            <div className="text-[var(--color-primary-100)]">T</div>
            <div className="text-[var(--color-primary-100)]">F</div>
            <div className="text-[var(--color-primary-100)]">S</div>
            <div className="text-[var(--color-primary-100)]">S</div>

            <div className="py-1 text-gray-500">30</div>
            <div className="py-1">1</div>
            <div className="py-1">2</div>
            <div className="py-1">3</div>
            <div className="py-1">4</div>
            <div className="py-1">5</div>
            <div className="py-1">6</div>

            <div className="py-1">7</div>
            <div className="py-1">8</div>
            <div className="py-1">9</div>
            <div className="py-1">10</div>
            <div className="py-1">11</div>
            <div className="py-1">12</div>
            <div className="py-1">13</div>

            <div className="py-1">14</div>
            <div className="py-1">15</div>
            <div className="py-1">16</div>
            <div className="py-1">17</div>
            <div className="py-1">18</div>
            <div className="py-1">19</div>
            <div className="py-1">20</div>

            <div className="py-1">21</div>
            <div className="py-1">22</div>
            <div className="py-1">23</div>
            <div className="py-1">24</div>
            <div className="py-1">25</div>
            <div className="py-1">26</div>
            <div className="py-1">27</div>

            <div className="py-1">28</div>
            <div className="py-1">29</div>
            <div className="py-1">30</div>
            <div className="py-1">31</div>
            <div className="py-1 text-gray-500">1</div>
            <div className="py-1 text-gray-500">2</div>
            <div className="py-1 text-gray-500">3</div>
          </div>
        </div>

        {/* WhatsApp Group */}
        <div className="border-2 border-neutral-500 rounded-[20px] p-5">
          <h3 className="font-medium mb-3 pb-3 border-b-2 border-neutral-500">
            WhatsApp Group
          </h3>
          <p className="text-sm text-gray-300">
            Grup WA ini khusus untuk yang sudah terdaftar, jadi jangan lupa
            daftar!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecondContent;
