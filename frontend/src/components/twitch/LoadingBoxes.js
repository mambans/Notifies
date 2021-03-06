import React from 'react';

import { LoadingVideoElement } from './StyledComponents';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export default ({ amount, type, load = true }) => {
  const array = Array.apply(null, Array(amount)).map(function (x, i) {
    return i;
  });

  if (load) {
    return (
      <TransitionGroup component={null}>
        {array.map((index) => {
          return (
            <CSSTransition key={index} timeout={250} classNames='fade-250ms' unmountOnExit>
              <LoadingVideoElement type={type} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    );
  }
  return null;
};
