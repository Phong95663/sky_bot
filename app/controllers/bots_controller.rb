class BotsController < ApplicationController
  protect_from_forgery except: :index
  skip_before_action :verify_authenticity_token

  include BotsHelper

  def create
    @questions = Question.all
    @question = params[:question].strip
    str1 = check_quest_ngram(@question, @questions)["question"]
    str2 = check_quest_ngram(@question, @questions)["answer"]
    if str1.nil?
      str = ["Câu hỏi chưa có"]
    else
      str = ["Câu hỏi: #{str1}", "Trả lời: #{str2}"]
    end
    respond_to do |format|
      format.json {render json: str}
    end
  end
end
