const Header = ({ name }) => {
   return <h1>{name}</h1>;
};

const Part = ({ part, exercises }) => {
   return (
      <p>
         {part} {exercises}
      </p>
   );
};

const Content = ({ parts }) => {

   return (
      <div>
         {
            parts.map(part =>
               <Part key={part.id} part={part.name} exercises={part.exercises} />
            )
         }
      </div>
   );
};

const Total = ({ parts }) => {
   let total = parts.reduce((accu, curr) => accu + curr.exercises, 0)
   return (
      <b>
         total of {total} exercises
      </b>
   );
};

const Course = ({ courses }) => {
   return (
      <div>
         {courses.map(course =>
            <div key={course.id}>
               <Header name={course.name} />
               <Content parts={course.parts} />
               <Total
                  parts={course.parts}
               />
            </div>
         )}
      </div>
   )
}

export default Course
