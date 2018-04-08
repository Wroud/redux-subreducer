# redux-subreducer

Redux-Subreducer can do:
1. deep state tree control
2. component local state control

Also provides detailed logging.
More completed example:
1. https://github.com/Wroud/ScheduleReact

## Install
```
npm install --save redux-subreducer react react-redux
```

## Documentation

* [API Reference](docs/README.md)

## Connect sub-reducer to redux
**1. Create sub reducer for `counter`**
```javascript
import { createAction, createMainReducer, LocalListener } from "redux-subreducer";

export const actions = {
    increment: createAction("Increment"),
    decrement: createAction("Decrement"),
};

const initalState = 0;

export const counterReducer =
    createSubReducer("counter", initalState)
        .on(actions.increment, state => state + 1)
        .on(actions.decrement, state => state - 1);
```
**2. Then create main reducer**
```javascript
import { routerReducer } from "react-router-redux";

const appInitalState = {};

export const appReducer =
    createMainReducer(appInitalState)
        .join(counterReducer)
        .joinReducer("routing", routerReducer) // you also can connect classic reducers
        .joinListener("listener", LocalListener); // or actions listener, its same reducer but not returning state
```
**3. Now create redux store**
```javascript
import { createStore } from "redux";

const store = createStore(appReducer.reducer, appInitalState);
/*
    {
        counter: 0,
        routing: {...}
    }
*/
```
**4. Dispatch actions!**
```javascript
store.dispatch(actions.increment);
/*
    {
        counter: 1,
        routing: {...}
    }
*/
store.dispatch(actions.decrement);
/*
    {
        counter: 0,
        routing: {...}
    }
*/
```

![Console log](https://i.imgur.com/BtB3wYJ.png)
## Connect component local store to `LocalReducer`
Since we connected `LocalListener` (step 2) we can connect React Component local store to `LocalReducer`

**1. Lets create one more action**
```javascript
export const switchDrawerAction = createAction("Switch Drawer");
```
**Layout.jsx**
```javascript
export class LayoutClass extends React.Component {
    render() {
        return 
            (
                <NavMenu switchDrawer={this.props.switchDrawer} />
            );
    }
}

function mapDispatchToProps(dispatch) {
  return {
    switchDrawer: () => dispatch(switchDrawerAction)
  }
}

export const Layout = connect(null, mapDispatchToProps)(LayoutClass);
```
**DrawerWraper.jsx**
```javascript
const initState = {
    open: true,
};

export class DrawerWraperClass extends React.Component {
    this.state = initState;
    render() {
        return (
            <Drawer open={this.state.open}>
                ...
            </Drawer>
        );
    }
}

const switchDrawer = (props, prevState) => ({ open: !prevState.open });

const stateReducer = reducer => reducer
    .on(switchDrawerAction, switchDrawer);


export const DrawerWrapper = connectState(
        initState,
        stateReducer,
        "drawer", // optional
    )(DrawerWraperClass);
```
**2. It works.**
![Console log](https://i.imgur.com/BE9EQXu.png)