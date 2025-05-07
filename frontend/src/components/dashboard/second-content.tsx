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
      <div className="col-span-2">
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">Enrolled Class</h3>
          <div className="flex items-center mb-2">
            <Clock size={16} className="mr-2 text-gray-400" />
            <p className="text-sm text-gray-300">
              Kamu bisa daftar 2 kelas: Intermediate dan I Entry data I Bundle
            </p>
          </div>

          {data.map((enrolledClass) => (
            <div
              key={enrolledClass.id}
              className="mt-4 bg-gray-900 rounded-lg p-4 flex"
            >
              <div className="w-16 h-16 bg-gray-700 rounded mr-4"></div>
              <div className="flex-grow">
                <h4 className="font-medium">{enrolledClass.message}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  {enrolledClass.description}
                </p>
                <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded text-sm">
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
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">July 2025</h3>
            <button className="bg-blue-600 text-white text-xs rounded px-2 py-1">
              Bukan data kelas hari
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            <div className="text-gray-400">Mon</div>
            <div className="text-gray-400">Tue</div>
            <div className="text-gray-400">Wed</div>
            <div className="text-gray-400">Thu</div>
            <div className="text-gray-400">Fri</div>
            <div className="text-gray-400">Sat</div>
            <div className="text-gray-400">Sun</div>

            <div className="py-1 text-gray-500">31</div>
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
            <div className="py-1 text-gray-500">1</div>
            <div className="py-1 text-gray-500">2</div>
            <div className="py-1 text-gray-500">3</div>
            <div className="py-1 text-gray-500">4</div>
          </div>
        </div>

        {/* WhatsApp Group */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-medium mb-4">WhatsApp Group</h3>
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
