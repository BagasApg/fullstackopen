const Header = ({ course }) => {
   return <h1>{course}</h1>;
};

const Part = ({ part, exercise }) => {
   return (
      <p>
         {part} {exercise}
      </p>
   );
};

const Content = (props) => {
   return (
      <div>
         <Part part={props.part1} exercise={props.exercises1} />
         <Part part={props.part2} exercise={props.exercises2} />
         <Part part={props.part3} exercise={props.exercises3} />
      </div>
   );
};

const Total = (props) => {
   return (
      <p>
         Number of exercises{" "}
         {props.exercises1 + props.exercises2 + props.exercises3}
      </p>
   );
};

const Course = ({ course }) => {
   console.log(course.parts[2].name)
   return (
      <div>
         <Header course={course.name} />
         <Content
            part1={course.parts[0].name}
            part2={course.parts[1].name}
            part3={course.parts[2].name}
            exercises1={exercises1}
            exercises2={exercises2}
            exercises3={exercises3}
         />
         <Total
            exercises1={exercises1}
            exercises2={exercises2}
            exercises3={exercises3}
         />
      </div>
   )
}

export default Course
