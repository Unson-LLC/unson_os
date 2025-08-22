// モバイル下部ナビゲーション
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, BarChart3, Activity, Bell, Settings 
} from 'lucide-react';

const MobileNavigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'ダッシュボード',
      isActive: pathname === '/'
    },
    {
      href: '/analytics',
      icon: BarChart3,
      label: '分析',
      isActive: pathname.startsWith('/analytics')
    },
    {
      href: '/activity',
      icon: Activity,
      label: 'アクティビティ',
      isActive: pathname.startsWith('/activity')
    },
    {
      href: '/notifications',
      icon: Bell,
      label: '通知',
      isActive: pathname.startsWith('/notifications'),
      badge: 3 // 未読通知数
    }
  ];

  return (
    <>
      {/* スペーサー - 固定ナビゲーションの高さ分 */}
      <div className="h-20 md:hidden" />
      
      {/* モバイル下部ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  item.isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 active:bg-gray-100'
                }`}
                style={{ minHeight: '48px', minWidth: '48px' }} // フィッツの法則対応
              >
                <div className="relative">
                  <Icon 
                    className={`w-6 h-6 mb-1 ${
                      item.isActive ? 'text-blue-600' : 'text-gray-600'
                    }`} 
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  item.isActive ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
                
                {/* アクティブインジケーター */}
                {item.isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;