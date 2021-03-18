import _ from 'lodash';
import * as React from 'react';
import { Formatter } from 'app/utils/formatter';
import './landing.scss';
import logo from './logo.png';
import screenshot from './screenshot.png';
import p7 from './7.png';
import p16 from './16.png';
import p20 from './20.png';

export const Landing = (props: Benchmark.Props) => {
  return (
    <div className="flex flex-col w-full landing">
      <header className="flex absolute px-10 pt-5 w-full justify-between items-center text-base">
        <div className="left">
          <img src={logo} className="w-40" />
        </div>
        <div className="right">
          <h2>FAQ</h2>
        </div>
      </header>
      <div className="hero flex justify-center">
        <div className="content flex flex-col max-w-screen-xl">
          <h2 className="text-6xl mt-32 mb-8 font-bold">Everything Team Needs, Gathers Here</h2>
          <div className="flex">
            <div className="flex flex-col w-1/2 mr-8">
              <p className="mb-10 text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus sequi sapiente unde, tempora rerum iste atque odio,
                accusamus iusto quam vero, minima sint explicabo ipsa. Possimus, error quo. Explicabo, omnis!
              </p>
              <button className="get-started">Get Started</button>
            </div>
            <div className="flex-grow">
              <img src={screenshot} />
            </div>
          </div>
        </div>
      </div>
      <div className="arbor mt-32 flex justify-center mb-32">
        <div className="exhibit flex flex-col max-w-screen-xl">
          <h2>Lorem ipsum, dolor sit amet consectetur adipisicing elit. </h2>
          <div className="bullets flex">
            <div className="point">
              <img src={p16} />

              <h4>Lorem ipsum dolor sit amet</h4>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi voluptatem porro perspiciatis voluptatibus sunt?
                Consequuntur rem dignissimos praesentium sapiente.{' '}
              </p>
            </div>
            <div className="point">
              <img src={p7} />
              <h4>Lorem ipsum dolor sit amet</h4>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi voluptatem porro perspiciatis voluptatibus sunt?
                Consequuntur rem dignissimos praesentium sapiente.{' '}
              </p>
            </div>
            <div className="point">
              <img src={p20} />
              <h4>Lorem ipsum dolor sit amet</h4>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi voluptatem porro perspiciatis voluptatibus sunt?
                Consequuntur rem dignissimos praesentium sapiente.{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
