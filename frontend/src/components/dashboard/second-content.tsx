import React from "react";
import { Clock } from "lucide-react";

type EnrolledClassData = {
  id: number;
  name: string;
  status: string;
  message: string;
  description: string;
};
type SecondContentProps = {
  data: EnrolledClassData[];
};
const SecondContent = ({ data }: SecondContentProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="col-span-2 border-2 border-neutral-500 rounded-[20px]">
        <div className="rounded-[20px] p-6 ">
          <h3 className="text-lg font-medium mb-4">Enrolled Class</h3>
          <div className="flex items-center mb-2 pb-3 border-b-2 border-neutral-500">
            <Clock size={16} className="mr-2 text-gray-400" />
            <p className="text-sm text-gray-300">
              Kamu bisa daftar 2 kelas: 1 Intermediate dan 1 Entry atau 1 Bundle
            </p>
          </div>

          {data.map((enrolledClass) => (
            <div
              key={enrolledClass.id}
              className="mt-4 flex h-auto border-2 border-neutral-500 rounded-[20px]"
            >
              <div className="w-35 h-35 bg-gray-700 rounded-[20px]"></div>
              <div className=" flex flex-col justify-between p-4">
                <div className="">
                  <p className="text-3">{enrolledClass.message}</p>
                  <p className="text-[12px] text-gray-400 mt-1">
                    {enrolledClass.description}
                  </p>
                </div>
                <button className="bg-primary-500 text-white py-2 px-3 rounded-lg font-bold text-[12px] self-start">
                  Eksplor Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
