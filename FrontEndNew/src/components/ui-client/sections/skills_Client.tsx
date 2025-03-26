"use client"

import { be_Skills_Data, fe_Skills_Data, fs_Skills_Data, other_Skills_Data } from '@/child';
import React from 'react';
import Skills_Data_Client from '../nested/skills_Data_Client';

const renderSkillsGroup = (skillsData: any[]) => (
    <div className="flex flex-row justify-around flex-wrap mt-4 gap-5 items-center">
        {skillsData.map((item, index) => (
            <Skills_Data_Client
                key={index}
                src={item.Image}
                width={item.width}
                height={item.height}
                index={index}
                animationDelay={0.5}
            />
        ))}
    </div>
);

const Skills_Client = () => (
    <div className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden py-20">
        {renderSkillsGroup(fe_Skills_Data)}
        {renderSkillsGroup(be_Skills_Data)}
        {renderSkillsGroup(fs_Skills_Data)}
        {renderSkillsGroup(other_Skills_Data)}
    </div>
);

export default Skills_Client;