import React from "react";

export default function LayoutThumbnail({ layoutId }: { layoutId: string }) {
  switch (layoutId) {
    case 'avatar-central':
      return (
        <div className="w-full h-full rounded-lg flex flex-col items-center justify-center bg-blue-50 border border-blue-100">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">A</span>
          </div>
        </div>
      );
    case 'avatar-lateral':
      return (
        <div className="w-full h-full rounded-lg flex items-center justify-center bg-teal-50 border border-teal-100 px-2">
          <div className="w-8 h-8 bg-teal-200 rounded-full flex items-center justify-center mr-2">
            <span className="text-teal-700 font-bold text-base">A</span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="w-3/4 h-2 bg-teal-300 rounded" />
            <div className="w-2/3 h-1 bg-teal-200 rounded" />
          </div>
        </div>
      );
    case 'texto-central':
      return (
        <div className="w-full h-full rounded-lg flex flex-col items-center justify-center bg-orange-50 border border-orange-100">
          <div className="w-3/4 h-2 bg-orange-300 rounded mb-1" />
          <div className="w-2/3 h-1 bg-orange-200 rounded" />
        </div>
      );
    case 'lista-itens':
      return (
        <div className="w-full h-full rounded-lg flex flex-col bg-red-50 border border-red-100 p-2">
          <div className="w-3/4 h-2 bg-red-300 rounded mb-1 mx-auto" />
          <div className="grid grid-cols-2 gap-1 flex-1">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-200 rounded-full" />
                <div className="flex-1 h-1 bg-red-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    case 'abertura':
      return (
        <div className="w-full h-full rounded-lg flex flex-col items-center justify-center bg-blue-50 border border-blue-100 relative">
          <div className="absolute top-2 left-2 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center border border-blue-100" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-100 rounded-full border border-blue-200 opacity-70" />
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-3/4 h-2 bg-blue-300 rounded mb-1" />
            <div className="w-2/3 h-1 bg-blue-200 rounded" />
          </div>
        </div>
      );
    case 'fechamento':
      return (
        <div className="w-full h-full rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100">
          <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300" />
        </div>
      );
    default:
      return (
        <div className="w-full h-full rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100">
          <div className="w-6 h-1 bg-gray-200 rounded"></div>
        </div>
      );
  }
} 