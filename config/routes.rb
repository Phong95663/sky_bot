Rails.application.routes.draw do
  root "bots#index"
  post "answer", to: "bots#create"
end
